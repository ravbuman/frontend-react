// Date and time utilities
export const formatMessageTime = (timestamp) => {
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

export const formatLastSeen = (lastSeen) => {
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);
  const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// String utilities
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

// Local storage utilities
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting storage item:', error);
    return false;
  }
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return defaultValue;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing storage item:', error);
    return false;
  }
};

// Array utilities
export const removeDuplicates = (array, key = null) => {
  if (key) {
    return array.filter((item, index, self) => 
      index === self.findIndex(t => t[key] === item[key])
    );
  }
  return [...new Set(array)];
};

// Object utilities
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Scroll utilities
export const scrollToBottom = (element, behavior = 'smooth') => {
  if (element) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: behavior
    });
  }
};

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// URL utilities
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Theme utilities
export const getThemeColors = () => ({
  primary: {
    50: '#f8f7ff',
    100: '#f0edff',
    200: '#e8e5ff',
    300: '#d4cfff',
    400: '#b8a7ff',
    500: '#8b5ff2',
    600: '#7c4ce6',
    700: '#6a3dd9',
    800: '#5a2fc7',
    900: '#4a25a3',
  },
  secondary: {
    50: '#fef7ff',
    100: '#feeeff',
    200: '#fce7ff',
    300: '#f9d0ff',
    400: '#f5a3ff',
    500: '#d946ef',
    600: '#c233d9',
    700: '#a821c7',
    800: '#8f1ba3',
    900: '#7a1685',
  }
});

const utils = {
  formatMessageTime,
  formatLastSeen,
  truncateText,
  capitalizeFirst,
  validateEmail,
  validateUsername,
  validatePassword,
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  removeDuplicates,
  deepClone,
  debounce,
  scrollToBottom,
  formatFileSize,
  getFileExtension,
  isValidUrl,
  getThemeColors,
};

export default utils;
