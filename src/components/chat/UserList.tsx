import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';

const UserList: React.FC = () => {
  const { users, selectedUserId, isLoading, error, fetchUsers, selectUser } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const { messages } = useChatStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  // Filter out the current user from the list
  const filteredUsers = users.filter(user => user.id !== currentUser?.id);

  // Get unread message count for each user
  const getUnreadCount = (userId: string) => {
    return messages.filter(m => m.senderId === userId && !m.isRead).length;
  };

  // Status colors
  const statusColors = {
    'Available': 'bg-green-500',
    'Busy': 'bg-red-500',
    'Away': 'bg-yellow-500',
    'Offline': 'bg-gray-500'
  };

  const handleSelectUser = (userId: string) => {
    selectUser(userId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-4 bg-primary-600 text-white">
        <h2 className="text-lg font-semibold">Colleagues</h2>
      </div>
      {filteredUsers.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No users available</div>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredUsers.map(user => {
            const unreadCount = getUnreadCount(user.id);
            
            return (
              <li 
                key={user.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedUserId === user.id ? 'bg-primary-50' : ''}`}
                onClick={() => handleSelectUser(user.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 relative">
                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColors[user.status] || 'bg-gray-500'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    <p className="text-sm text-gray-500 truncate">{user.status}</p>
                  </div>
                  {unreadCount > 0 && (
                    <div className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserList;