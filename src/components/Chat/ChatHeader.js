import React from 'react';
import { useChat } from '../../context/ChatContext';
import { getAvatarByUserId } from '../../assets/avatars';

const ChatHeader = ({ user }) => {
  const { onlineUsers, typingUsers } = useChat();
  
  // Add safety checks
  if (!user) {
    return null;
  }
  
  const isUserOnline = onlineUsers?.includes?.(user._id) || false;
  const isUserTyping = typingUsers?.[user._id] || false;
  const avatar = getAvatarByUserId(user._id);
  
  // Get display name and first letter safely
  const displayName = user.profile?.displayName || user.phoneNumber || 'Unknown User';
  const firstLetter = displayName.charAt(0).toUpperCase();

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Offline';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
    return `Active ${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Avatar */}
          <div className="relative">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-200"
              style={{
                background: `linear-gradient(135deg, ${avatar.color} 0%, ${avatar.color}CC 100%)`
              }}
            >
              {firstLetter}
            </div>
            {/* Enhanced Online Status */}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              user.isOnline || isUserOnline ? 'bg-green-400 shadow-lg shadow-green-400/50 animate-pulse' : 'bg-gray-400'
            }`}></div>
          </div>

          {/* User Details */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              {displayName}
              {/* Verified badge */}
              <svg className="w-4 h-4 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </h2>
            
            {/* Status */}
            <div className="flex items-center space-x-2">
              {isUserTyping ? (
                <div className="flex items-center text-blue-500 text-sm">
                  <div className="flex space-x-1 mr-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span className="font-medium">Typing...</span>
                </div>
              ) : (
                <p className={`text-sm font-medium ${
                  user.isOnline || isUserOnline ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {user.isOnline || isUserOnline ? '● Online' : formatLastSeen(user.lastSeen)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Video Call Button */}
          <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 group">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Voice Call Button */}
          <button className="p-3 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-110 group">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>

          {/* More Options */}
          <button className="p-3 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-110 group">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
