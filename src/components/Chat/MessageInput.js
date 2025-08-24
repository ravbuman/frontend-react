import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { 
    sendMessage, 
    currentChatUser, 
    startTyping, 
    stopTyping 
  } = useChat();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle typing indicators
  useEffect(() => {
    if (message.trim() && !isTyping && currentChatUser) {
      setIsTyping(true);
      startTyping(currentChatUser._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    if (message.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping && currentChatUser) {
          setIsTyping(false);
          stopTyping(currentChatUser._id);
        }
      }, 1000);
    } else if (isTyping && currentChatUser) {
      setIsTyping(false);
      stopTyping(currentChatUser._id);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, currentChatUser, startTyping, stopTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentChatUser) {
      return;
    }

    const messageContent = message.trim();
    setMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      stopTyping(currentChatUser._id);
    }

    // Send message
    const result = await sendMessage(messageContent, currentChatUser._id);
    
    if (!result.success) {
      console.error('Failed to send message:', result.error);
      // Could show error notification here
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachment = () => {
    // TODO: Implement file attachment
    alert('File attachment feature coming soon!');
  };

  const handleEmoji = () => {
    // TODO: Implement emoji picker
    alert('Emoji picker coming soon!');
  };

  return (
    <div className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={handleAttachment}
          className="flex-shrink-0 p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl button-smooth"
          title="Attach file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Message Input Container */}
        <div className="flex-1 relative">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 button-smooth shadow-sm hover:shadow-md glass-effect">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${currentChatUser?.username || currentChatUser?.profile?.displayName || 'user'}...`}
              className="w-full px-4 py-3 pr-12 bg-transparent border-none outline-none resize-none min-h-[48px] max-h-32 placeholder-gray-400 text-gray-800 rounded-2xl"
              style={{wordWrap: 'break-word'}}
              rows={1}
              disabled={!currentChatUser}
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={handleEmoji}
              className="absolute bottom-3 right-3 p-1 text-gray-400 hover:text-blue-500 button-smooth"
              title="Add emoji"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || !currentChatUser}
          className={`
            flex-shrink-0 p-3 rounded-full button-smooth smooth-animation
            ${message.trim() && currentChatUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl gradient-animate'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          title="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Enhanced Typing Indicator */}
      {message.trim() && (
        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
            <span>Press Enter to send</span>
          </div>
          <span className="text-gray-400">Shift+Enter for new line</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
