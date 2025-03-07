// // src/__tests__/authStore.test.ts
// import { act } from 'react-dom/test-utils';
// import { renderHook } from '@testing-library/react-hooks';
// import { useAuthStore } from '../stores/authStore';
// import { authService } from '../services/authService';
// import { socketService } from '../services/socketService';

// // Mock the services
// jest.mock('../services/authService');
// jest.mock('../services/socketService');

// describe('Auth Store', () => {
//   beforeEach(() => {
//     // Clear all mock implementations
//     jest.clearAllMocks();
    
//     // Reset the store
//     const { result } = renderHook(() => useAuthStore());
//     act(() => {
//       result.current.logout();
//     });
//   });

//   test('initial state', () => {
//     const { result } = renderHook(() => useAuthStore());
    
//     expect(result.current.user).toBeNull();
//     expect(result.current.isAuthenticated).toBe(false);
//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.error).toBeNull();
//   });

//   test('login success', async () => {
//     const mockUser = {
//       id: 'user-1',
//       username: 'John Doe',
//       email: 'john@example.com',
//       status: 'Available'
//     };
    
//     const mockToken = 'fake-token';
    
//     (authService.login as jest.Mock).mockResolvedValue({
//       user: mockUser,
//       token: mockToken
//     });

//     const { result } = renderHook(() => useAuthStore());
    
//     await act(async () => {
//       await result.current.login('john@example.com', 'password');
//     });
    
//     expect(result.current.user).toEqual(mockUser);
//     expect(result.current.token).toBe(mockToken);
//     expect(result.current.isAuthenticated).toBe(true);
//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.error).toBeNull();
//     expect(socketService.init).toHaveBeenCalledWith(mockToken);
//   });

//   test('login failure', async () => {
//     const errorMessage = 'Invalid credentials';
//     (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

//     const { result } = renderHook(() => useAuthStore());
    
//     await act(async () => {
//       try {
//         await result.current.login('wrong@example.com', 'wrong-password');
//       } catch (error) {
//         // Error is expected
//       }
//     });
    
//     expect(result.current.user).toBeNull();
//     expect(result.current.isAuthenticated).toBe(false);
//     expect(result.current.isLoading).toBe(false);
//     expect(result.current.error).toBe(errorMessage);
//     expect(socketService.init).not.toHaveBeenCalled();
//   });

//   test('logout', () => {
//     const { result } = renderHook(() => useAuthStore());
    
//     // First login (mock a logged in state)
//     act(() => {
//       result.current.login = jest.fn();
//       useAuthStore.setState({
//         user: { id: 'user-1', username: 'John Doe', email: 'john@example.com', status: 'Available' },
//         token: 'fake-token',
//         isAuthenticated: true
//       });
//     });
    
//     // Then logout
//     act(() => {
//       result.current.logout();
//     });
    
//     expect(result.current.user).toBeNull();
//     expect(result.current.token).toBeNull();
//     expect(result.current.isAuthenticated).toBe(false);
//     expect(socketService.disconnect).toHaveBeenCalled();
//   });
// });