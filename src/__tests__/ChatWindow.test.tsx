// // src/__tests__/ChatWindow.test.tsx
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import ChatWindow from '../components/chat/ChatWindow';
// import { useAuthStore } from '../stores/authStore';
// import { useChatStore } from '../stores/chatStore';

// // Mock Zustand stores
// jest.mock('../stores/authStore');
// jest.mock('../stores/chatStore');

// describe('ChatWindow Component', () => {
//   const mockCurrentUser = {
//     id: 'user-1',
//     username: 'John Doe',
//     email: 'john@example.com',
//     status: 'Available'
//   };

//   const mockSelectedUser = {
//     id: 'user-2',
//     username: 'Jane Smith',
//     email: 'jane@example.com',
//     status: 'Available'
//   };

//   const mockMessages = [
//     {
//       id: 'msg-1',
//       content: 'Hello',
//       senderId: 'user-1',
//       receiverId: 'user-2',
//       timestamp: new Date(),
//       isRead: true
//     },
//     {
//       id: 'msg-2',
//       content: 'Hi there',
//       senderId: 'user-2',
//       receiverId: 'user-1',
//       timestamp: new Date(),
//       isRead: true
//     }
//   ];

//   beforeEach(() => {
//     (useAuthStore as jest.Mock).mockReturnValue({
//       user: mockCurrentUser
//     });

//     (useChatStore as jest.Mock).mockReturnValue({
//       messages: mockMessages,
//       replyingTo: null,
//       isLoading: false,
//       fetchMessages: jest.fn(),
//       sendMessage: jest.fn(),
//       setReplyingTo: jest.fn(),
//       markMessagesAsRead: jest.fn()
//     });
//   });

//   test('renders placeholder when no user is selected', () => {
//     render(<ChatWindow selectedUser={null} />);
    
//     expect(screen.getByText('Select a user to start chatting')).toBeInTheDocument();
//   });

//   test('renders chat interface when user is selected', () => {
//     render(<ChatWindow selectedUser={mockSelectedUser} />);
    
//     // Check header elements
//     expect(screen.getByText('Jane Smith')).toBeInTheDocument();
//     expect(screen.getByText('Available')).toBeInTheDocument();
    
//     // Check messages
//     expect(screen.getByText('Hello')).toBeInTheDocument();
//     expect(screen.getByText('Hi there')).toBeInTheDocument();
    
//     // Check input area
//     expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
//   });

//   test('sends a message when form is submitted', () => {
//     const mockSendMessage = jest.fn();
    
//     (useChatStore as jest.Mock).mockReturnValue({
//       messages: mockMessages,
//       replyingTo: null,
//       isLoading: false,
//       fetchMessages: jest.fn(),
//       sendMessage: mockSendMessage,
//       setReplyingTo: jest.fn(),
//       markMessagesAsRead: jest.fn()
//     });

//     render(<ChatWindow selectedUser={mockSelectedUser} />);
    
//     // Type a message
//     fireEvent.change(screen.getByPlaceholderText('Type a message...'), {
//       target: { value: 'New message' }
//     });
    
//     // Send the message
//     fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
//     // Check if sendMessage was called with the right parameters
//     expect(mockSendMessage).toHaveBeenCalledWith(
//       'New message',
//       'user-1',
//       'user-2',
//       undefined
//     );
//   });
// });