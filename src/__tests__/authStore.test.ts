import { act } from 'react-dom/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { socketService } from '../services/socketService';

jest.mock('../services/authService');
jest.mock('../services/socketService');

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  test('initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('login success', async () => {
    const mockUser = {
      id: 'user-1',
      username: 'Bharath',
      email: 'nharath@example.com',
      status: 'Available'
    };
    
    const mockToken = 'fake-token';
    
    (authService.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: mockToken
    });

    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('bharath@example.com', 'password');
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(socketService.init).toHaveBeenCalledWith(mockToken);
  });

  test('login failure', async () => {
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      try {
        await result.current.login('wrong@example.com', 'wrong-password');
      } catch (error) {
        console.log('Error in Login:', error);
      }
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(socketService.init).not.toHaveBeenCalled();
  });

  test('logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.login = jest.fn();
      useAuthStore.setState({
        user: { id: 'user-1', username: 'Bharath', email: 'bharath@example.com', status: 'Available' },
        token: 'fake-token',
        isAuthenticated: true
      });
    });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(socketService.disconnect).toHaveBeenCalled();
  });
});