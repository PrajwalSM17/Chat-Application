import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/chat/UserList';
import ChatWindow from '../components/chat/ChatWindow';
import StatusSelector from '../components/chat/StatusSelector';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { socketService } from '../services/socketService';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { users, selectedUserId, clearSelectedUser } = useUserStore();
  const { clearMessages } = useChatStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    // Disconnect socket
    socketService.disconnect();
    
    // Clear states
    clearSelectedUser();
    clearMessages();
    logout();
    
    // Navigate to login
    navigate('/login');
  };

  const selectedUser = selectedUserId 
    ? users.find(u => u.id === selectedUserId) || null 
    : null;

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Company Chat</h1>
          <div className="flex items-center space-x-4">
            <StatusSelector currentStatus={user.status} />
            <div className="text-sm font-medium">{user.username}</div>
            <button 
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded bg-primary-600 hover:bg-primary-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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