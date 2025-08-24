import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { getAvatarByUserId } from '../../assets/avatars';
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
      const result = await searchUsers(searchTerm);
      
      if (result.success) {
        setUsers(result.data.users || []);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const timeoutId = setTimeout(() => {
        loadUsers();
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else if (searchTerm.length === 0) {
      // If search is cleared, load all users
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleUserClick = async (user) => {
    try {
      // Pass the entire user object, not just the ID
      selectUser(user);
    } catch (err) {
      console.error('Error selecting user:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to select user. Please try again.',
        confirmButtonColor: '#8B5CF6'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium">Finding conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button 
            onClick={loadUsers}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Users Found</h3>
          <p className="text-gray-500">
            {searchTerm ? `No results for "${searchTerm}"` : 'Start by inviting someone to chat!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {users.map((user) => {
            const avatar = getAvatarByUserId(user._id);
            const isSelected = currentChatUser?._id === user._id;
            const displayName = user.profile?.displayName || user.displayName || `User ${user.phoneNumber?.slice(-4)}`;
            const phoneNumber = user.phoneNumber;
            
            return (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`
                  group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02]
                  ${isSelected 
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 shadow-md' 
                    : 'hover:bg-white/70 hover:shadow-lg hover:border hover:border-gray-200/50'
                  }
                `}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
                )}
                
                <div className="flex items-center space-x-4">
                  {/* Enhanced Avatar */}
                  <div className="relative flex-shrink-0">
                    <div 
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold text-white
                        shadow-lg transition-all duration-200 group-hover:scale-110
                        ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                      `}
                      style={{
                        background: `linear-gradient(135deg, ${avatar.color} 0%, ${avatar.color}CC 100%)`
                      }}
                    >
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    
                    {/* Online Status */}
                    <div className="absolute -bottom-1 -right-1">
                      <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`
                        font-semibold truncate transition-colors duration-200
                        ${isSelected 
                          ? 'text-blue-700' 
                          : 'text-gray-800 group-hover:text-gray-900'
                        }
                      `}>
                        {displayName}
                      </h4>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        Online
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`
                        text-sm truncate transition-colors duration-200
                        ${isSelected 
                          ? 'text-blue-600' 
                          : 'text-gray-500 group-hover:text-gray-600'
                        }
                      `}>
                        {phoneNumber ? `+91 ${phoneNumber}` : 'Available to chat'}
                      </p>
                      
                      {/* Message indicator */}
                      <div className="flex items-center space-x-2">
                        {/* Unread count indicator */}
                        {Math.random() > 0.7 && (
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                        )}
                        
                        {/* Chevron for selected user */}
                        {isSelected && (
                          <svg className="w-4 h-4 text-blue-500 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserList;
