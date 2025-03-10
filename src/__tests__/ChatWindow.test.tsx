import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatWindow from '../components/chat/ChatWindow';

type UserStatus = 'Available' | 'Busy' | 'Away' | 'Offline';

interface User {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
}

const mockUser: User = {
  id: 'user-1',
  username: 'Bharath',
  email: 'bharath@example.com',
  status: 'Available' 
};

const mockSelectedUser: User = {
  id: 'user-2',
  username: 'Hanumanth',
  email: 'hanumanth@example.com',
  status: 'Available' 
};

const mockMessages = [
  {
    id: 'msg-1',
    content: 'Hello',
    senderId: 'user-1',
    receiverId: 'user-2',
    timestamp: new Date(),
    isRead: true
  },
  {
    id: 'msg-2',
    content: 'Hi there',
    senderId: 'user-2',
    receiverId: 'user-1',
    timestamp: new Date(),
    isRead: true
  }
];

jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn()
}));

jest.mock('../store/chatStore', () => ({
  useChatStore: jest.fn()
}));

import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

describe('ChatWindow Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser
    });
    
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      messages: mockMessages,
      replyingTo: null,
      isLoading: false,
      fetchMessages: jest.fn(),
      sendMessage: jest.fn(),
      setReplyingTo: jest.fn(),
      markMessagesAsRead: jest.fn()
    });
  });

  test('renders placeholder when no user is selected', () => {
    render(<ChatWindow selectedUser={null} />);
    expect(screen.getByText('Select a user to start chatting')).toBeInTheDocument();
  });

  test('renders chat interface when user is selected', () => {
    render(<ChatWindow selectedUser={mockSelectedUser} />);
   
    expect(screen.getByText('Bharath')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
   
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
   
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('sends a message when form is submitted', () => {
    const mockSendMessage = jest.fn();
   
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      messages: mockMessages,
      replyingTo: null,
      isLoading: false,
      fetchMessages: jest.fn(),
      sendMessage: mockSendMessage,
      setReplyingTo: jest.fn(),
      markMessagesAsRead: jest.fn()
    });
    
    render(<ChatWindow selectedUser={mockSelectedUser} />);
   
    fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
      target: { value: 'New message' }
    });
   
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
   
    expect(mockSendMessage).toHaveBeenCalledWith(
      'New message',
      'user-1',
      'user-2',
      undefined
    );
  });
});