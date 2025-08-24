import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  
  const { 
    setCurrentChatUser, 
    currentChatUser, 
    onlineUsers, 
    searchUsers 
  } = useChat();
  const { user: currentUser } = useAuth();

  // Load all users on component mount
  useEffect(() => {
    const loadAllUsers = async () => {
      setIsLoadingUsers(true);
      try {
        // Try to search for all users with empty query (this will get all users)
        const result = await searchUsers('');
        if (result.success) {
          const filteredUsers = result.users.filter(user => user._id !== currentUser?._id);
          setAllUsers(filteredUsers);
          setSearchResults(filteredUsers);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        setAllUsers([]);
        setSearchResults([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (currentUser) {
      loadAllUsers();
    }
  }, [currentUser, searchUsers]);

  // Search users with debouncing
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchQuery.trim()) {
      setSearchTimeout(setTimeout(async () => {
        setIsSearching(true);
        try {
          const result = await searchUsers(searchQuery);
          if (result.success) {
            const filteredUsers = result.users.filter(user => user._id !== currentUser?._id);
            setSearchResults(filteredUsers);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300));
    } else {
      setSearchResults(allUsers);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchQuery, searchUsers, allUsers, currentUser, searchTimeout]);

  const handleUserSelect = (user) => {
    setCurrentChatUser(user);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Never';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const displayUsers = searchQuery.trim() ? searchResults : allUsers;

  if (isLoadingUsers) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border-light">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              disabled
              className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg opacity-50"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-text-muted">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-border-light">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {displayUsers.length === 0 ? (
          <div className="p-4 text-center text-text-muted">
            {searchQuery.trim() ? 'No users found' : 'No users available'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {displayUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-background-secondary ${
                  currentChatUser?._id === user._id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-500">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                    {/* Online Status */}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      isUserOnline(user._id) ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-text-primary truncate">
                        {user.username}
                      </h3>
                      <span className="text-xs text-text-muted">
                        {isUserOnline(user._id) ? 'Online' : formatLastSeen(user.lastSeen)}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted truncate">
                      {user.phoneNumber || user.email || 'No contact info'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-light bg-background-secondary">
        <div className="text-center text-sm text-text-muted">
          {displayUsers.length} user{displayUsers.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
};

export default UserList;
