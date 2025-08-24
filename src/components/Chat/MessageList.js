import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { getAvatarByUserId } from '../../assets/avatars';
import Button from '../UI/Button';
import Swal from 'sweetalert2';

const MessageList = () => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const { 
    messages = [], // Default to empty array
    loadMoreMessages, 
    hasMoreMessages = false, // Default values
    isLoading = false,
    deleteMessage,
    editMessage,
    currentChatUser,
    typingUsers = {} // Add typing users
  } = useChat();
  const { user: currentUser } = useAuth();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle scroll to show/hide scroll-to-bottom button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  // Load more messages when scrolled to top
  const handleLoadMore = () => {
    if (hasMoreMessages && !isLoading) {
      loadMoreMessages();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const result = await Swal.fire({
      title: 'Delete Message?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteMessage(messageId);
      if (deleteResult.success) {
        Swal.fire({
          icon: 'success',
          title: 'Message Deleted',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: deleteResult.error || 'Could not delete message',
          confirmButtonColor: '#8B5CF6'
        });
      }
    }
  };

  const handleEditMessage = async (messageId, currentContent) => {
    const { value: newContent } = await Swal.fire({
      title: 'Edit Message',
      input: 'textarea',
      inputValue: currentContent,
      inputPlaceholder: 'Type your message...',
      showCancelButton: true,
      confirmButtonColor: '#8B5CF6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel'
    });

    if (newContent && newContent.trim() !== currentContent) {
      const result = await editMessage(messageId, newContent.trim());
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Message Updated',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: result.error || 'Could not update message',
          confirmButtonColor: '#8B5CF6'
        });
      }
    }
  };

  // Display messages (ensure it's always an array)
  const displayMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex flex-col h-full relative">
      {/* Load More Button */}
      {hasMoreMessages && (
        <div className="p-4 text-center border-b border-border-light flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleLoadMore}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Load More Messages
          </Button>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#94A3B8 #F1F5F9',
          WebkitScrollbar: {
            width: '8px'
          }
        }}
      >
        {displayMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              {currentChatUser ? (
                <>
                  {/* User Avatar */}
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white">
                      <img 
                        src={getAvatarByUserId(currentChatUser?.id)?.src || getAvatarByUserId(currentChatUser?._id)?.src || '/avatars/avatar1.png'}
                        alt={currentChatUser?.profile?.displayName || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl"
                        style={{display: 'none'}}
                      >
                        {currentChatUser?.profile?.displayName ? 
                          currentChatUser.profile.displayName.charAt(0).toUpperCase() : 
                          (currentChatUser?.phoneNumber ? 
                            currentChatUser.phoneNumber.charAt(currentChatUser.phoneNumber.length - 1) : 
                            'U'
                          )
                        }
                      </div>
                    </div>
                    {currentChatUser?.isOnline && (
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {currentChatUser?.profile?.displayName || currentChatUser?.phoneNumber || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    {currentChatUser?.profile?.displayName ? 
                      (currentChatUser?.phoneNumber || 'No phone number') : 
                      'Start your conversation!'
                    }
                  </p>
                  
                  {/* Message Icon */}
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  
                  <p className="text-text-muted text-sm">
                    No messages yet. Send a message to start the conversation!
                  </p>
                </>
              ) : (
                <>
                  {/* General Empty State */}
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">Select a User</h3>
                  <p className="text-text-muted text-sm">
                    Choose someone from the user list to start chatting
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          displayMessages.filter(message => message && message._id).map((message) => {
            // Safely access sender information with fallbacks
            const senderId = message.senderId?._id || message.senderId || message.sender?._id;
            const isOwn = senderId === currentUser?._id;
            
            // Safely get timestamp
            const timestamp = message.timestamp || message.createdAt || message.delivery?.sentAt || message.metadata?.createdAt;
            
            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwn 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md shadow-lg' 
                    : 'bg-white border border-gray-200/50 rounded-bl-md shadow-md'
                } relative transform transition-transform duration-200 hover:scale-[1.02] break-words`} style={{wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '75%'}}>
                  
                  {/* Message Content */}
                  <p className={`text-sm ${isOwn ? 'text-white' : 'text-gray-800'} leading-relaxed break-words`} style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                    {message.content || 'No content'}
                  </p>
                  
                  {/* Timestamp */}
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {timestamp ? formatTime(timestamp) : 'Now'}
                    {isOwn && (message.isRead || message.status === 'read') && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </p>

                  {/* Message Actions (shown on hover for own messages) */}
                  {isOwn && (
                    <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => handleEditMessage(message._id, message.content || '')}
                          className="p-1 text-gray-400 hover:text-blue-500 bg-white rounded shadow-sm transition-colors duration-200"
                          title="Edit message"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="p-1 text-gray-400 hover:text-red-500 bg-white rounded shadow-sm transition-colors duration-200"
                          title="Delete message"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {currentChatUser && typingUsers[currentChatUser._id] && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 border border-gray-200/50 rounded-bl-md shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-gray-500">
                  {currentChatUser?.profile?.displayName || currentChatUser?.phoneNumber || 'User'} is typing...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lavender-lg hover:bg-primary-600 transition-all duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MessageList;
