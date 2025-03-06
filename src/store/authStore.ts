import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';
import { socketService } from '../services/socketService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateStatus: (status: 'Available' | 'Busy' | 'Away' | 'Offline') => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      let response = await authService.login({ email, password });
      response.user.status = 'Available';
      set({ 
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        token: response.token
      });
      localStorage.setItem('token', response.token);
      
      // Initialize socket connection
      socketService.init(response.token);
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      await authService.register({ username, email, password });
      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  
  updateStatus: async (status: 'Available' | 'Busy' | 'Away' | 'Offline') => {
    try {
      // Optimistically update the local state
      set({ 
        user: get().user ? { ...get().user!, status } : null 
      });
      
      // Send update to the server via WebSocket
      socketService.updateStatus(status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  },
  
  logout: () => {
    // Disconnect socket
    socketService.disconnect();
    console.log('User Status Changed to Offline')
    // Clear state and local storage
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
}));