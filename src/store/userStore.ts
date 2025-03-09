import { create } from 'zustand';
import { User } from '../types';
import { userService } from '../services/userService';

interface UserState {
  users: User[];
  selectedUserId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  selectUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: 'Available' | 'Busy' | 'Away' | 'Offline') => void;
  clearSelectedUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUserId: null,
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const users = await userService.getAllUsers();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  
  selectUser: (userId: string) => {
    set({ selectedUserId: userId });
  },
  
  updateUserStatus: (userId: string, status: 'Available' | 'Busy' | 'Away' | 'Offline') => {
    set((state) => ({
      users: state.users.map(user => 
        user.id === userId ? { ...user, status } : user
      )
    }));
  },
  
  clearSelectedUser: () => {
    set({ selectedUserId: null });
  }
}));