import { io, Socket } from "socket.io-client";
import { Message } from "../types";
import { useChatStore } from "../store/chatStore";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  // Initialize the socket connection
  init(token: string): void {
    this.token = token;

    // Get user ID from the auth store
    const userId = useAuthStore.getState().user?.id;

    // Include both token and userId in the auth
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
        userId, // Send userId explicitly for testing
      },
    });

    this.setupListeners();

    // Emit login event once connected
    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");

      // Automatically set status to Available
      this.updateStatus("Available");
    });
  }

  // Set up event listeners for the socket
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      
    });

    // Listen for incoming messages (from other users)
    this.socket.on("message", (message: Message) => {
      console.log("Received message:", message);
      const chatStore = useChatStore.getState();
      chatStore.receiveMessage(message);
    });

    // Listen for message sent confirmations (for our own messages)
    this.socket.on("message-sent", (message: Message) => {
      console.log("Message sent confirmation:", message);
      const chatStore = useChatStore.getState();
      chatStore.receiveMessage(message);
    });

    // Listen for user status changes
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

  // Send a message
  sendMessage(message: Omit<Message, "id" | "timestamp" | "isRead">): void {
    if (!this.socket) {
      console.error("Socket not initialized, cannot send message");
      return;
    }
    this.socket.emit("send-message", message);
  }

  // Update user status
  updateStatus(status: "Available" | "Busy" | "Away" | "Offline"): void {
    if (!this.socket) {
      console.error("Socket not initialized, cannot update status");
      return;
    }
    this.socket.emit("update-status", { status });
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
