import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { messagesAPI, usersAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  messages: [],
  onlineUsers: [],
  typingUsers: {},
  currentChatUser: null,
  isLoading: false,
  error: null,
  hasMoreMessages: true,
  currentPage: 1,
};

// Action types
const ChatActionTypes = {
  SET_CURRENT_CHAT_USER: 'SET_CURRENT_CHAT_USER',
  LOAD_MESSAGES_START: 'LOAD_MESSAGES_START',
  LOAD_MESSAGES_SUCCESS: 'LOAD_MESSAGES_SUCCESS',
  LOAD_MESSAGES_FAILURE: 'LOAD_MESSAGES_FAILURE',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  SET_ONLINE_USERS: 'SET_ONLINE_USERS',
  ADD_ONLINE_USER: 'ADD_ONLINE_USER',
  REMOVE_ONLINE_USER: 'REMOVE_ONLINE_USER',
  SET_USER_TYPING: 'SET_USER_TYPING',
  REMOVE_USER_TYPING: 'REMOVE_USER_TYPING',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_HAS_MORE_MESSAGES: 'SET_HAS_MORE_MESSAGES',
  INCREMENT_PAGE: 'INCREMENT_PAGE',
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ChatActionTypes.SET_CURRENT_CHAT_USER:
      return {
        ...state,
        currentChatUser: action.payload,
        messages: [],
        currentPage: 1,
        hasMoreMessages: true,
      };

    case ChatActionTypes.LOAD_MESSAGES_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ChatActionTypes.LOAD_MESSAGES_SUCCESS:
      const incomingMessages = Array.isArray(action.payload.messages) ? action.payload.messages : [];
      
      // Check for duplicates by ID to prevent API reload duplicates
      const existingIds = new Set(state.messages.map(msg => msg._id));
      const newUniqueMessages = incomingMessages.filter(msg => !existingIds.has(msg._id));
      
      const finalMessages = action.payload.append 
        ? [...newUniqueMessages, ...state.messages]
        : incomingMessages;
      
      console.log('📊 LOAD_MESSAGES_SUCCESS - incoming:', incomingMessages.length, 'final:', finalMessages.length);
      
      return {
        ...state,
        messages: finalMessages,
        isLoading: false,
        error: null,
      };

    case ChatActionTypes.LOAD_MESSAGES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case ChatActionTypes.ADD_MESSAGE:
      // Check for duplicate by _id or messageId
      const exists = state.messages.some(existingMsg =>
        existingMsg._id === action.payload._id ||
        (existingMsg.messageId && existingMsg.messageId === action.payload.messageId)
      );
      if (exists) {
        console.log('⚠️ [REDUCER] Message already exists, skipping:', action.payload._id, action.payload.messageId);
        return state;
      }
      console.log('✅ [REDUCER] Adding new message:', action.payload._id, action.payload.messageId);
      return {
        ...state,
        messages: [...(Array.isArray(state.messages) ? state.messages : []), action.payload],
      };

    case ChatActionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        messages: (Array.isArray(state.messages) ? state.messages : []).map(msg => 
          msg._id === action.payload._id ? action.payload : msg
        ),
      };

    case ChatActionTypes.DELETE_MESSAGE:
      return {
        ...state,
        messages: (Array.isArray(state.messages) ? state.messages : []).filter(msg => msg._id !== action.payload),
      };

    case ChatActionTypes.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.payload,
      };

    case ChatActionTypes.ADD_ONLINE_USER:
      return {
        ...state,
        onlineUsers: state.onlineUsers.includes(action.payload)
          ? state.onlineUsers
          : [...state.onlineUsers, action.payload],
      };

    case ChatActionTypes.REMOVE_ONLINE_USER:
      return {
        ...state,
        onlineUsers: state.onlineUsers.filter(userId => userId !== action.payload),
      };

    case ChatActionTypes.SET_USER_TYPING:
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload]: true,
        },
      };

    case ChatActionTypes.REMOVE_USER_TYPING:
      const newTypingUsers = { ...state.typingUsers };
      delete newTypingUsers[action.payload];
      return {
        ...state,
        typingUsers: newTypingUsers,
      };

    case ChatActionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
        currentPage: 1,
        hasMoreMessages: true,
      };

    case ChatActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ChatActionTypes.SET_HAS_MORE_MESSAGES:
      return {
        ...state,
        hasMoreMessages: action.payload,
      };

    case ChatActionTypes.INCREMENT_PAGE:
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };

    default:
      return state;
  }
};

// Create context
const ChatContext = createContext();

// Chat provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  // eslint-disable-next-line no-unused-vars
  const { user, isAuthenticated } = useAuth();

  // Setup socket listeners
  useEffect(() => {
    if (!isAuthenticated || !socketService.socket) return;

    // Message listeners
    const handleNewMessage = (data) => {
      console.log('📨 [SOCKET] Received message event:', data);
      const message = data.message || data;
      if (!message._id) {
        console.warn('⚠️ [SOCKET] Message missing _id, using messageId:', message.messageId);
        // Fallback: use messageId as _id if present
        message._id = message.messageId || `temp_${Date.now()}`;
      }
      console.log('📨 [SOCKET] Processing message:', {
        _id: message._id,
        messageId: message.messageId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        status: data.status,
      });
      // Add message to state
      dispatch({
        type: ChatActionTypes.ADD_MESSAGE,
        payload: message,
      });
    };

    const handleMessageDeleted = (messageId) => {
      dispatch({
        type: ChatActionTypes.DELETE_MESSAGE,
        payload: messageId,
      });
    };

    const handleMessageEdited = (message) => {
      dispatch({
        type: ChatActionTypes.UPDATE_MESSAGE,
        payload: message,
      });
    };

    // User status listeners
    const handleUserOnline = (userId) => {
      dispatch({
        type: ChatActionTypes.ADD_ONLINE_USER,
        payload: userId,
      });
    };

    const handleUserOffline = (userId) => {
      dispatch({
        type: ChatActionTypes.REMOVE_ONLINE_USER,
        payload: userId,
      });
    };

    // Typing listeners
    const handleUserTyping = (data) => {
      console.log('🔤 User typing received:', data);
      dispatch({
        type: ChatActionTypes.SET_USER_TYPING,
        payload: data.userId,
      });
    };

    const handleUserStoppedTyping = (data) => {
      console.log('🔤 User stopped typing received:', data);
      dispatch({
        type: ChatActionTypes.REMOVE_USER_TYPING,
        payload: data.userId,
      });
    };

    // Register listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onMessageDeleted(handleMessageDeleted);
    socketService.onMessageEdited(handleMessageEdited);
    socketService.onUserOnline(handleUserOnline);
    socketService.onUserOffline(handleUserOffline);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStoppedTyping(handleUserStoppedTyping);

    // Cleanup function
    return () => {
      socketService.removeListener('message-received', handleNewMessage);
      socketService.removeListener('message-deleted', handleMessageDeleted);
      socketService.removeListener('message-edited', handleMessageEdited);
      socketService.removeListener('user-online', handleUserOnline);
      socketService.removeListener('user-offline', handleUserOffline);
      socketService.removeListener('typing-start', handleUserTyping);
      socketService.removeListener('typing-stop', handleUserStoppedTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Load online users on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadOnlineUsers();
    }
  }, [isAuthenticated]);

  // Set current chat user
  const setCurrentChatUser = (chatUser) => {
    dispatch({
      type: ChatActionTypes.SET_CURRENT_CHAT_USER,
      payload: chatUser,
    });
  };

  // Load messages for current chat
  const loadMessages = useCallback(async (userId, page = 1, append = false) => {
    try {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`🔄 [${timestamp}] Loading messages for userId:`, userId, 'page:', page, 'append:', append);
      
      if (!append) {
        dispatch({ type: ChatActionTypes.LOAD_MESSAGES_START });
      }

      const response = await messagesAPI.getMessages(userId, page, 50);
      console.log(`📥 [${timestamp}] API Response:`, response.data);
      const responseData = response.data.data || response.data;
      const messages = Array.isArray(responseData?.messages) ? responseData.messages : [];
      console.log(`✅ [${timestamp}] Processed messages count:`, messages.length);

      dispatch({
        type: ChatActionTypes.LOAD_MESSAGES_SUCCESS,
        payload: { messages, append },
      });

      if (messages.length < 50) {
        dispatch({
          type: ChatActionTypes.SET_HAS_MORE_MESSAGES,
          payload: false,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load messages';
      dispatch({
        type: ChatActionTypes.LOAD_MESSAGES_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!state.hasMoreMessages || state.isLoading || !state.currentChatUser) return;

    const nextPage = state.currentPage + 1;
    const result = await loadMessages(state.currentChatUser._id, nextPage, true);
    
    if (result.success) {
      dispatch({ type: ChatActionTypes.INCREMENT_PAGE });
    }
  };

  // Send message
  const sendMessage = useCallback(async (content, recipientId) => {
    try {
      console.log('🚀 SendMessage called:', { content, recipientId });
      
      const messageData = {
        content,
        receiverId: recipientId,
        messageType: 'text'
      };

      console.log('🚀 Sending message via socket only:', messageData);

      // Only use socket - it will handle database saving and emission
      socketService.sendMessage(messageData);

      console.log('✅ Message sent via socket - waiting for confirmation');
      return { success: true };
    } catch (error) {
      console.error('❌ SendMessage error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      socketService.deleteMessage(messageId);
      await messagesAPI.deleteMessage(messageId);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete message';
      return { success: false, error: errorMessage };
    }
  };

  // Edit message
  const editMessage = async (messageId, content) => {
    try {
      socketService.editMessage(messageId, content);
      await messagesAPI.editMessage(messageId, content);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to edit message';
      return { success: false, error: errorMessage };
    }
  };

  // Start typing
  const startTyping = (recipientId) => {
    socketService.startTyping(recipientId);
  };

  // Stop typing
  const stopTyping = (recipientId) => {
    socketService.stopTyping(recipientId);
  };

  // Load online users
  const loadOnlineUsers = async () => {
    try {
      const response = await usersAPI.getOnlineUsers();
      dispatch({
        type: ChatActionTypes.SET_ONLINE_USERS,
        payload: response.data.onlineUsers || [],
      });
    } catch (error) {
      console.error('Failed to load online users:', error);
    }
  };

  // Search users
  const searchUsers = useCallback(async (query) => {
    try {
      const response = await usersAPI.searchUsers(query);
      const data = response.data.data || response.data;
      const users = data.users || [];
      return { success: true, data: { users } };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to search users';
      return { success: false, error: errorMessage, data: { users: [] } };
    }
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    dispatch({ type: ChatActionTypes.CLEAR_MESSAGES });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ChatActionTypes.CLEAR_ERROR });
  }, []);

  // Select user for chat
  const selectUser = useCallback((user) => {
    console.log('👤 Selecting user:', user?.profile?.displayName || user?.phoneNumber, 'ID:', user?._id);
    setCurrentChatUser(user);
    // Clear any existing messages when switching users
    clearMessages();
    // Load messages for the selected user
    if (user && user._id) {
      loadMessages(user._id);
    }
  }, [loadMessages, clearMessages]);

  const value = {
    ...state,
    setCurrentChatUser,
    selectUser,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    deleteMessage,
    editMessage,
    startTyping,
    stopTyping,
    searchUsers,
    clearError,
    clearMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
