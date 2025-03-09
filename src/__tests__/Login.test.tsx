// // src/__tests__/Login.test.tsx
// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import Login from '../pages/Login';
// import { useAuthStore } from '../stores/authStore';

// // Mock the Zustand store
// jest.mock('../stores/authStore');

// describe('Login Component', () => {
//   beforeEach(() => {
//     // Mock implementation of useAuthStore
//     (useAuthStore as jest.Mock).mockReturnValue({
//       login: jest.fn(),
//       isAuthenticated: false,
//       isLoading: false,
//       error: null
//     });
//   });

//   test('renders login form correctly', () => {
//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );
    
//     expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
//     expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
//     expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
//   });

//   test('submits the form with email and password', async () => {
//     const mockLogin = jest.fn().mockResolvedValue(undefined);
    
//     (useAuthStore as jest.Mock).mockReturnValue({
//       login: mockLogin,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null
//     });

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     fireEvent.change(screen.getByPlaceholderText('Email address'), {
//       target: { value: 'test@example.com' }
//     });
    
//     fireEvent.change(screen.getByPlaceholderText('Password'), {
//       target: { value: 'password123' }
//     });
    
//     fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
//     await waitFor(() => {
//       expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
//     });
//   });

//   test('displays error message when login fails', () => {
//     (useAuthStore as jest.Mock).mockReturnValue({
//       login: jest.fn(),
//       isAuthenticated: false,
//       isLoading: false,
//       error: 'Invalid credentials'
//     });

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );
    
//     expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
//   });

//   test('shows loading state during authentication', () => {
//     (useAuthStore as jest.Mock).mockReturnValue({
//       login: jest.fn(),
//       isAuthenticated: false,
//       isLoading: true,
//       error: null
//     });

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );
    
//     expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
//   });
// });