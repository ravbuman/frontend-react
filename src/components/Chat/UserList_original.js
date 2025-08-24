import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import Swal from 'sweetalert2';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { searchUsers, selectUser, currentChatUser } = useChat();

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await searchUsers(''); // Empty string to get all users
        
        if (result.success) {
          setUsers(result.data.users || []);
        } else {
          setError('Failed to load users');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load users. Please try again.',
            confirmButtonColor: '#8B5CF6'
          });
        }
      } catch (err) {
        setError('Failed to load users');
        console.error('Error loading users:', err);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Could not connect to server. Please check your connection.',
          confirmButtonColor: '#8B5CF6'
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await searchUsers(''); // Empty string to get all users
      
      if (result.success) {
        setUsers(result.data.users || []);
      } else {
        setError('Failed to load users');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load users. Please try again.',
          confirmButtonColor: '#8B5CF6'
        });
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Could not connect to server. Please check your connection.',
        confirmButtonColor: '#8B5CF6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError('');
      const result = await searchUsers(query);
      
      if (result.success) {
        setUsers(result.data.users || []);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError('Search failed');
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleUserSelect = (user) => {
    selectUser(user);
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Chat Started',
      text: `You are now chatting with ${user.profile?.displayName || user.phoneNumber}`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const getOnlineStatusIndicator = (user) => {
    if (user.isOnline) {
      return (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      );
    } else if (user.status === 'away') {
      return (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></div>
      );
    } else {
      return (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"></div>
      );
    }
  };

  const getLastSeenText = (user) => {
    if (user.isOnline) {
      return 'Online';
    } else if (user.lastSeen) {
      const lastSeen = new Date(user.lastSeen);
      const now = new Date();
      const diffMs = now - lastSeen;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 5) {
        return 'Just now';
      } else if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return lastSeen.toLocaleDateString();
      }
    } else {
      return 'Offline';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-r border-border-light h-full flex flex-col">
        <div className="p-4 border-b border-border-light">
          <h2 className="text-lg font-semibold text-text-primary mb-3">Users</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
              disabled
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-3"></div>
            <p className="text-text-muted">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-r border-border-light h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-light">
        <h2 className="text-lg font-semibold text-text-primary mb-3">Users</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={loadUsers}
          className="mt-2 w-full py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200"
          disabled={loading}
        >
          Refresh Users
        </button>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 border-b border-red-200 bg-red-50">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={loadUsers}
              className="text-red-700 underline text-sm mt-1"
            >
              Try again
            </button>
          </div>
        )}

        {users.length === 0 && !loading && !error && (
          <div className="p-4 text-center">
            <div className="text-text-muted">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No users found</p>
              <p className="text-sm mt-1">Try adjusting your search</p>
            </div>
          </div>
        )}

        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`p-4 border-b border-border-light hover:bg-background-secondary cursor-pointer transition-all duration-200 ${
              currentChatUser?._id === user._id ? 'bg-primary-50 border-primary-200' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar with online status */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.profile?.displayName ? 
                    user.profile.displayName.charAt(0).toUpperCase() : 
                    user.phoneNumber.charAt(user.phoneNumber.length - 1)
                  }
                </div>
                {getOnlineStatusIndicator(user)}
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user.profile?.displayName || user.phoneNumber}
                  </p>
                  {user.isOnline && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted truncate">
                  {user.profile?.displayName ? user.phoneNumber : getLastSeenText(user)}
                </p>
              </div>
              
              {/* Message Icon */}
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-3.757 1.257L8 16.757A7.96 7.96 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
