import { io, Socket } from 'socket.io-client';
import { Message } from '../types';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  // Initialize the socket connection
  init(token: string): void {
    this.token = token;
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    this.setupListeners();
  }

  // Set up event listeners for the socket
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Listen for incoming messages
    this.socket.on('message', (message: Message) => {
      const chatStore = useChatStore.getState();
      chatStore.receiveMessage(message);
    });

    // Listen for user status changes
    this.socket.on('status-update', ({ userId, status }: { userId: string; status: 'Available' | 'Busy' | 'Away' | 'Offline' }) => {
      const userStore = useUserStore.getState();
      userStore.updateUserStatus(userId, status);
    });
  }

  // Send a message
  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): void {
    if (!this.socket) return;
    this.socket.emit('send-message', message);
  }

  // Update user status
  updateStatus(status: 'Available' | 'Busy' | 'Away' | 'Offline'): void {
    if (!this.socket) return;
    this.socket.emit('update-status', { status });
  }

  // Disconnect the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();