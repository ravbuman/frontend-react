import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Messages API calls
export const messagesAPI = {
  getMessages: (chatId, page = 1, limit = 50) => 
    api.get(`/chat/history/${chatId}?page=${page}&limit=${limit}`),
  sendMessage: (messageData) => api.post('/chat/send', messageData),
  deleteMessage: (messageId) => api.delete(`/chat/message/${messageId}`),
  editMessage: (messageId, content) => 
    api.put(`/chat/message/${messageId}`, { content }),
};

// Users API calls
export const usersAPI = {
  searchUsers: (query) => api.get(`/chat/search-users?q=${encodeURIComponent(query || '')}&limit=50`),
  getUser: (userId) => api.get(`/users/${userId}`),
  getOnlineUsers: () => api.get('/chat/online-users'),
};

// Chats API calls (if you plan to add group chats later)
export const chatsAPI = {
  getChats: () => api.get('/chats'),
  createChat: (chatData) => api.post('/chats', chatData),
  getChatDetails: (chatId) => api.get(`/chats/${chatId}`),
  addUserToChat: (chatId, userId) => api.post(`/chats/${chatId}/users`, { userId }),
  removeUserFromChat: (chatId, userId) => api.delete(`/chats/${chatId}/users/${userId}`),
};

export default api;
