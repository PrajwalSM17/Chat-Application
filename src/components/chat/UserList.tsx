import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

const UserList: React.FC = () => {
  const { users, selectedUserId, isLoading, error, fetchUsers, selectUser } =
    useUserStore();
  const { user: currentUser } = useAuthStore();
  const { messages } = useChatStore();
  const [enteredText, setEnteredText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search input
  const findUser = (searchQuery: string) => {
    if (!searchQuery) return users;

    // Only trigger actual filtering if the user has typed something
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  // Filter out the current user from the list
  const usersWithoutCurrent = users.filter(
    (user) => user.id !== currentUser?.id
  );

  // Apply search filter if there is search text
  const filteredUsers = enteredText
    ? usersWithoutCurrent.filter((user) =>
        user.username.toLowerCase().includes(enteredText.toLowerCase())
      )
    : usersWithoutCurrent;

  // Get unread message count for each user
  const getUnreadCount = (userId: string) => {
    return messages.filter((m) => m.senderId === userId && !m.isRead).length;
  };

  // Status colors
  const statusColors = {
    Available: "bg-green-500",
    Busy: "bg-red-500",
    Away: "bg-yellow-500",
    Offline: "bg-gray-500",
  };

  const handleSelectUser = (userId: string) => {
    selectUser(userId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Sticky header section */}
      <div className="p-2 bg-primary-600 text-white sticky top-0 z-10 h-20">
        <h2 className="text-lg font-semibold mb-2">Colleagues</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-purple-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            className="w-full h-1/2 py-1 pl-10 pr-3 bg-purple-200 bg-opacity-30 text-white placeholder-purple-200 focus:outline-none border-b-2 border-purple-400 focus:border-white transition-colors rounded-md"
            placeholder="Search colleagues..."
            value={enteredText}
            onChange={(e) => {
              const newText = e.target.value;
              setEnteredText(newText);
            }}
          />
        </div>
      </div>

      {/* Scrollable user list */}
      {filteredUsers.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          {enteredText ? "No matching users found" : "No users available"}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 overflow-y-auto flex-1">
          {filteredUsers.map((user) => {
            const unreadCount = getUnreadCount(user.id);

            return (
              <li
                key={user.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedUserId === user.id ? "bg-primary-50" : ""
                }`}
                onClick={() => handleSelectUser(user.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 relative">
                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        statusColors[user.status] || "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.status}
                    </p>
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
