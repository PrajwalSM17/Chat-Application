import { create } from "zustand";
import { Message } from "../types";
import { chatService } from "../services/chatService";
import { socketService } from "../services/socketService";

interface ChatState {
  messages: Message[];
  replyingTo: Message | null;
  isLoading: boolean;
  error: string | null;
  fetchMessages: (userId1: string, userId2: string) => Promise<void>;
  sendMessage: (
    content: string,
    senderId: string,
    receiverId: string,
    replyToId?: string
  ) => Promise<void>;
  receiveMessage: (message: Message) => void;
  setReplyingTo: (message: Message | null) => void;
  markMessagesAsRead: (senderId: string, receiverId: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  replyingTo: null,
  isLoading: false,
  error: null,

  fetchMessages: async (userId1: string, userId2: string) => {
    try {
      set({ isLoading: true, error: null });
      const messages = await chatService.getMessagesBetweenUsers(
        userId1,
        userId2
      );
      set({ messages, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  sendMessage: async (content: string, senderId: string, receiverId: string, replyToId?: string) => {
    try {
      set({ isLoading: true, error: null });
      const messageToSend = {
        content,
        senderId,
        receiverId,
        replyTo: replyToId
      };
      socketService.sendMessage(messageToSend);
      set({ isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
    }
  },
  receiveMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
    console.log("storeeeeee message:-->", message);
  },

  setReplyingTo: (message: Message | null) => {
    set({ replyingTo: message });
  },

  markMessagesAsRead: async (senderId: string, receiverId: string) => {
    try {
      await chatService.markMessagesAsRead(senderId);

      set((state) => ({
        messages: state.messages.map((message) => {
          if (
            message.senderId === senderId &&
            message.receiverId === receiverId &&
            !message.isRead
          ) {
            return { ...message, isRead: true };
          }
          return message;
        }),
      }));
    } catch (error) {
      console.error("Mark messages as read error:", error);
    }
  },

  clearMessages: () => {
    set({ messages: [], replyingTo: null });
  },
}));
