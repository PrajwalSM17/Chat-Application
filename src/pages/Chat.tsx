import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../components/chat/UserList";
import ChatWindow from "../components/chat/ChatWindow";
import StatusSelector from "../components/chat/StatusSelector";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useChatStore } from "../store/chatStore";
import { socketService } from "../services/socketService";
import { LogOut, User as UserIcon } from "lucide-react";

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { users, selectedUserId, clearSelectedUser } = useUserStore();
  const { clearMessages } = useChatStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    // Disconnect socket
    socketService.disconnect();

    // Clear states
    clearSelectedUser();
    clearMessages();
    logout();

    // Navigate to login
    navigate("/login");
  };

  const selectedUser = selectedUserId
    ? users.find((u) => u.id === selectedUserId) || null
    : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-primary-700 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* <img src="https://tetherfi.com/wp-content/uploads/2021/08/Logo.svg" className="bg-slate-100"></img> */}
          <h1 className="text-xl font-bold">Tetherfi</h1>
          <div className="flex items-center space-x-4">
            <StatusSelector currentStatus={user.status} />
            <div className="flex items-center space-x-2">
              <UserIcon size={18} className="text-primary-300" />
              <div className="text-sm font-medium">{user.username}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded bg-primary-600 hover:bg-primary-800 flex items-center justify-center"
              title="Logout"
            >
              <LogOut size={18} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 h-[calc(100vh-120px)]">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <UserList />
          </div>
          <div className="flex-1">
            <ChatWindow selectedUser={selectedUser} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
