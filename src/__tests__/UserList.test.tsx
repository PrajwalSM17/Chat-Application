import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../components/chat/UserList';

jest.mock('../store/userStore', () => ({
  useUserStore: jest.fn()
}));

jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn()
}));

jest.mock('../store/chatStore', () => ({
  useChatStore: jest.fn()
}));

import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';

describe('UserList Component', () => {
  const mockUsers = [
    {
      id: 'user-1',
      username: 'Bharath',
      email: 'bharath@example.com',
      status: 'Available'
    },
    {
      id: 'user-2',
      username: 'Hanumanth',
      email: 'hanumanth@example.com',
      status: 'Busy'
    },
    {
      id: 'user-3',
      username: 'Arvind',
      email: 'arvind@example.com',
      status: 'Away'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      users: mockUsers,
      selectedUserId: null,
      isLoading: false,
      error: null,
      fetchUsers: jest.fn(),
      selectUser: jest.fn()
    });
    
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: mockUsers[0]
    });
    
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      messages: []
    });
  });

  test('renders user list correctly', () => {
    render(<UserList />);
    
    expect(screen.getByText('Colleagues')).toBeInTheDocument();
    expect(screen.getByText('Bharath')).toBeInTheDocument();
    expect(screen.getByText('Hanumanth')).toBeInTheDocument();
    
    expect(screen.queryByText('Arvind')).not.toBeInTheDocument();
  });

  test('calls selectUser when a user is clicked', () => {
    const mockSelectUser = jest.fn();
    
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      users: mockUsers,
      selectedUserId: null,
      isLoading: false,
      error: null,
      fetchUsers: jest.fn(),
      selectUser: mockSelectUser
    });

    render(<UserList />);
    
    fireEvent.click(screen.getByText('Jane Smith'));
    
    expect(mockSelectUser).toHaveBeenCalledWith('user-2');
  });

  test('shows loading state', () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      users: [],
      selectedUserId: null,
      isLoading: true,
      error: null,
      fetchUsers: jest.fn(),
      selectUser: jest.fn()
    });

    render(<UserList />);
    
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      users: [],
      selectedUserId: null,
      isLoading: false,
      error: 'Failed to fetch users',
      fetchUsers: jest.fn(),
      selectUser: jest.fn()
    });

    render(<UserList />);
    
    expect(screen.getByText('Error: Failed to fetch users')).toBeInTheDocument();
  });
});