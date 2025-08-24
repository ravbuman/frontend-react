import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';

const ChatInterface = () => {
  const { user, logout } = useAuth();
  const { 
    currentChatUser, 
    loadMessages,
    clearMessages 
  } = useChat();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load messages when chat user changes
  useEffect(() => {
    if (currentChatUser) {
      clearMessages();
      loadMessages(currentChatUser._id);
      setIsMobileMenuOpen(false); // Close mobile menu on chat selection
    }
  }, [currentChatUser, clearMessages, loadMessages]);

  // Close mobile menu on window resize to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Modern glassmorphism container */}
      <div className="max-w-7xl mx-auto p-4 h-screen">
        <div className="h-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex h-full">
            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            
            {/* Sidebar */}
            <div className={`${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 transition-transform duration-300 ease-in-out lg:flex lg:flex-col`}>
              
              {/* Modern Sidebar Header */}
              <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 gradient-animate">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg avatar-pulse smooth-animation">
                        <span className="text-lg font-semibold text-white">
                          {user?.profile?.displayName?.[0]?.toUpperCase() || user?.phoneNumber?.slice(-1) || 'U'}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {user?.profile?.displayName || user?.phoneNumber || 'User'}
                      </h2>
                      <p className="text-sm text-green-500 font-medium">● Online</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 button-smooth group"
                      title="Logout"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                    
                    {/* Mobile close button */}
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 button-smooth"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Search Bar */}
                <div className="mt-4">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200 placeholder-gray-400 group-hover:bg-white/70"
                    />
                    <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Enhanced User List */}
              <div className="flex-1 overflow-hidden">
                <UserList />
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Mobile header with menu button */}
              <div className="lg:hidden flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 button-smooth"
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Messages
                </h1>
                
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 button-smooth"
                  title="Logout"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {currentChatUser ? (
                <>
                  {/* Enhanced Chat Header */}
                  <ChatHeader user={currentChatUser} />
                  
                  {/* Messages Area */}
                  <div className="flex-1 bg-gradient-to-b from-gray-50/20 to-blue-50/20 overflow-hidden">
                    <MessageList />
                  </div>
                  
                  {/* Enhanced Message Input */}
                  <MessageInput />
                </>
              ) : (
                /* Welcome Screen */
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50/20 to-blue-50/30">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      {/* Floating particles animation */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      Welcome to Your Messages
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      Select a conversation from the sidebar to start chatting. 
                      Your messages are end-to-end secured and delivered in real-time.
                    </p>
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="lg:hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
                      </svg>
                      Browse Conversations
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
