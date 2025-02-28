export interface User {
    id: string;
    username: string;
    email: string;
    status: 'Available' | 'Busy' | 'Away' | 'Offline';
    avatar?: string;
  }
  
  export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
    isRead: boolean;
    replyTo?: string;
  }
  
  export interface Chat {
    id: string;
    participants: string[];
    lastMessage?: Message;
    unreadCount: number;
  }