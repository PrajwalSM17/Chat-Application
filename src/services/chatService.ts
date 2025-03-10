import api from './api';
import { Message } from '../types';

interface SendMessageData {
  content: string;
  receiverId: string;
  replyToId?: string;
}

export const chatService = {
  getMessagesBetweenUsers: async (userId1: string, userId2: string): Promise<Message[]> => {
    try {
      const response = await api.get<Message[]>(`/messages?user1=${userId1}&user2=${userId2}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  sendMessage: async (data: SendMessageData): Promise<Message> => {
    try {
      const response = await api.post<Message>('/messages', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  markMessagesAsRead: async (senderId: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.patch<{ success: boolean }>(`/messages/read/${senderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
};