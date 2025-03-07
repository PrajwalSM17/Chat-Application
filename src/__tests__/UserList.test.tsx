// // src/__tests__/UserList.test.tsx
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import UserList from '../components/chat/UserList';
// import { useUserStore } from '../stores/userStore';
// import { useAuthStore } from '../stores/authStore';
// import { useChatStore } from '../stores/chatStore';

// // Mock the Zustand stores
// jest.mock('../stores/userStore');
// jest.mock('../stores/authStore');
// jest.mock('../stores/chatStore');

// describe('UserList Component', () => {
//   const mockUsers = [
//     {
//       id: 'user-1',
//       username: 'John Doe',
//       email: 'john@example.com',
//       status: 'Available'
//     },
//     {
//       id: 'user-2',
//       username: 'Jane Smith',
//       email: 'jane@example.com',
//       status: 'Busy'
//     },
//     {
//       id: 'user-3',
//       username: 'Bob Johnson',
//       email: 'bob@example.com',
//       status: 'Away'
//     }
//   ];

//   beforeEach(() => {
//     (useUserStore as jest.Mock).mockReturnValue({
//       users: mockUsers,
//       selectedUserId: null,
//       isLoading: false,
//       error: null,
//       fetchUsers: jest.fn(),
//       selectUser: jest.fn()
//     });
    
//     (useAuthStore as jest.Mock).mockReturnValue({
//       user: mockUsers[0]
//     });
    
//     (useChatStore as jest.Mock).mockReturnValue({
//       messages: []
//     });
//   });

//   test('renders user list correctly', () => {
//     render(<UserList />);
    
//     expect(screen.getByText('Colleagues')).toBeInTheDocument();
//     expect(screen.getByText('Jane Smith')).toBeInTheDocument();
//     expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    
//     // Current user (John Doe) should not be in the list
//     expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
//   });

//   test('calls selectUser when a user is clicked', () => {
//     const mockSelectUser = jest.fn();
    
//     (useUserStore as jest.Mock).mockReturnValue({
//       users: mockUsers,
//       selectedUserId: null,
//       isLoading: false,
//       error: null,
//       fetchUsers: jest.fn(),
//       selectUser: mockSelectUser
//     });

//     render(<UserList />);
    
//     // Click on a user
//     fireEvent.click(screen.getByText('Jane Smith'));
    
//     // Check if selectUser was called with the right user ID
//     expect(mockSelectUser).toHaveBeenCalledWith('user-2');
//   });

//   test('shows loading state', () => {
//     (useUserStore as jest.Mock).mockReturnValue({
//       users: [],
//       selectedUserId: null,
//       isLoading: true,
//       error: null,
//       fetchUsers: jest.fn(),
//       selectUser: jest.fn()
//     });

//     render(<UserList />);
    
//     expect(screen.getByText('Loading users...')).toBeInTheDocument();
//   });

//   test('shows error state', () => {
//     (useUserStore as jest.Mock).mockReturnValue({
//       users: [],
//       selectedUserId: null,
//       isLoading: false,
//       error: 'Failed to fetch users',
//       fetchUsers: jest.fn(),
//       selectUser: jest.fn()
//     });

//     render(<UserList />);
    
//     expect(screen.getByText('Error: Failed to fetch users')).toBeInTheDocument();
//   });
// });