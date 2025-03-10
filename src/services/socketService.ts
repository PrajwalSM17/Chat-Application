import { io, Socket } from "socket.io-client";
import { Message } from "../types";
import { useChatStore } from "../store/chatStore";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  init(token: string): void {
    this.token = token;
    const userId = useAuthStore.getState().user?.id;
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
        userId, 
      },
    });

    this.setupListeners();

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      this.updateStatus("Available");
    });
  }
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      
    });
    this.socket.on("message", (message: Message) => {
      const chatStore = useChatStore.getState();
      chatStore.receiveMessage(message);
    });
    this.socket.on("message-sent", (message: Message) => {
      const chatStore = useChatStore.getState();
      chatStore.receiveMessage(message);
    });

    this.socket.on(
      "status-update",
      ({
        userId,
        status,
      }: {
        userId: string;
        status: "Available" | "Busy" | "Away" | "Offline";
      }) => {
        const userStore = useUserStore.getState();
        userStore.updateUserStatus(userId, status);
      }
    );
  }

  sendMessage(message: Omit<Message, "id" | "timestamp" | "isRead">): void {
    if (!this.socket) {
      console.error("Socket not initialized, cannot send message");
      return;
    }
    this.socket.emit("send-message", message);
  }

  updateStatus(status: "Available" | "Busy" | "Away" | "Offline"): void {
    if (!this.socket) {
      console.error("Socket not initialized, cannot update status");
      return;
    }
    this.socket.emit("update-status", { status });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
