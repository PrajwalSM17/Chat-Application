import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { User, Message } from "../../types";

interface ChatWindowProps {
  selectedUser: User | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser }) => {
  const { user: currentUser } = useAuthStore();
  const {
    messages,
    replyingTo,
    isLoading,
    fetchMessages,
    sendMessage,
    setReplyingTo,
    markMessagesAsRead,
  } = useChatStore();

  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when selected user changes
  useEffect(() => {
    if (selectedUser && currentUser) {
      fetchMessages(currentUser.id, selectedUser.id);
      setLastMessageTime(new Date()); // Track when we loaded messages
    }
  }, [selectedUser, currentUser, fetchMessages]);

  // Mark messages as read and check for new messages
  useEffect(() => {
    if (selectedUser && currentUser && messages.length > 0) {
      // Mark messages from selected user as read
      const unreadMessages = messages.filter(
        (m) =>
          m.senderId === selectedUser.id &&
          m.receiverId === currentUser.id &&
          !m.isRead
      );

      if (unreadMessages.length > 0) {
        // Only uncomment this when the backend endpoint is ready
        // markMessagesAsRead(selectedUser.id, currentUser.id);
        
        // For now, mark them as read locally
        // This would be handled by your markMessagesAsRead implementation
      }

      // Check if there's a new message since we last checked
      if (lastMessageTime) {
        const newMessages = messages.filter(
          (m: any) => 
            new Date(m.createdAt || m.timestamp) > lastMessageTime &&
            m.senderId === selectedUser.id
        );

        if (newMessages.length > 0) {
          // Play notification sound or show a visual indicator
          // This is optional but enhances the user experience
          console.log("New messages received:", newMessages.length);
          setLastMessageTime(new Date());
        }
      }
    }
  }, [selectedUser, currentUser, messages, lastMessageTime]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser || !currentUser) return;

    try {
      await sendMessage(
        messageText,
        currentUser.id,
        selectedUser.id,
        replyingTo?.id
      );

      setMessageText("");
      // Clear the replyingTo state after sending the message
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
  };

  // If there's no selected user or current user, show placeholder
  if (!selectedUser || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  // Filter messages between the current user and selected user,
  // transform and sort them by timestamp
  const filteredMessages = messages
    .filter(
      (message: any) =>
        (message.senderId === currentUser.id &&
          message.receiverId === selectedUser.id) ||
        (message.senderId === selectedUser.id &&
          message.receiverId === currentUser.id)
    )
    .map((message: any) => ({
      ...message,
      timestamp: message.createdAt || message.timestamp,
      isRead: message.read ?? message.isRead ?? false, // Handle both read and isRead properties
    }))
    .sort((a: any, b: any) => {
      // Sort by timestamp (oldest messages first)
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

  // Function to get the referenced message for replies
  const getReferencedMessage = (replyToId?: string) => {
    if (!replyToId) return null;
    return messages.find((m) => m.id === replyToId);
  };

  return (
    <div className="flex-1 flex flex-col rounded-lg shadow-lg bg-white overflow-hidden h-full">
      {/* Sticky header */}
      <div className="p-4 bg-primary-600 text-white flex items-center sticky top-0">
        <div className="flex-shrink-0 relative mr-3">
          <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
            {selectedUser.username.charAt(0).toUpperCase()}
          </div>
          <div
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary-600 
            ${
              selectedUser.status === "Available"
                ? "bg-green-500"
                : selectedUser.status === "Busy"
                ? "bg-red-500"
                : selectedUser.status === "Away"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          ></div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{selectedUser.username}</h2>
          <p className="text-xs text-primary-100">{selectedUser.status}</p>
        </div>
      </div>

      {/* Messages - Scrollable area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {filteredMessages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
        <div className="space-y-4">
          {filteredMessages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const referencedMessage = getReferencedMessage(message.replyTo);
            // Check if this message is already a reply to prevent nested replies
            const isAlreadyAReply = message.replyTo !== undefined && message.replyTo !== null;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] ${
                    isCurrentUser ? "bg-primary-500 text-white" : "bg-primary-200"
                  } rounded-lg shadow p-3 relative group`}
                  onClick={() =>
                    !isCurrentUser && !isAlreadyAReply && handleReplyToMessage(message)
                  }
                >
                  {referencedMessage && (
                    <div
                      className={`text-xs p-2 mb-2 rounded ${
                        isCurrentUser ? "bg-primary-400" : "bg-gray-100"
                      }`}
                    >
                      <div className="font-semibold">
                        {referencedMessage.senderId === currentUser.id
                          ? "You"
                          : selectedUser.username}
                      </div>
                      <div className="truncate">
                        {referencedMessage.content}
                      </div>
                    </div>
                  )}
                  <div>{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-primary-200" : "text-gray-400"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isCurrentUser && message.isRead && (
                      <span className="ml-2">✓</span>
                    )}
                  </div>
                  {!isCurrentUser && !isAlreadyAReply && (
                    <button
                      className="hidden group-hover:block absolute -top-3 right-0 bg-gray-200 rounded-full p-1 text-xs text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReplyToMessage(message);
                      }}
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply to message (if any) - Sticky at bottom */}
      {replyingTo && (
        <div className="px-4 pt-2 bg-gray-100 border-t">
          <div className="flex justify-between items-center text-sm p-2 bg-white rounded">
            <div>
              <span className="font-semibold">
                Reply to{" "}
                {replyingTo.senderId === currentUser.id
                  ? "yourself"
                  : selectedUser.username}
                :
              </span>
              <span className="ml-2 text-gray-600 truncate">
                {replyingTo.content}
              </span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message input - Sticky at bottom */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <textarea
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder="Type a message..."
            rows={1}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
          ></textarea>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !messageText.trim()}
            className="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;