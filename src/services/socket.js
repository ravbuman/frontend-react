import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    console.log('Connecting to socket with token:', token ? 'Token provided' : 'No token');

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server with socket ID:', this.socket.id);
      this.isConnected = true;
      
      // Test connection
      setTimeout(() => {
        this.testConnection();
      }, 1000);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error);
      this.isConnected = false;
    });

    // Add listener for incoming messages to debug
    this.socket.on('message-received', (data) => {
      console.log('📨 Raw message received in socket service:', data);
    });

    // Add listeners for typing events to debug
    this.socket.on('typing-start', (data) => {
      console.log('🔤 Raw typing start received:', data);
    });

    this.socket.on('typing-stop', (data) => {
      console.log('🔤 Raw typing stop received:', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Message events
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('message-received', callback);
    }
  }

  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('messageDeleted', callback);
    }
  }

  onMessageEdited(callback) {
    if (this.socket) {
      this.socket.on('messageEdited', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  onStopTyping(callback) {
    if (this.socket) {
      this.socket.on('stopTyping', callback);
    }
  }

  // User events
  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user-online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user-offline', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('typing-start', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('typing-stop', callback);
    }
  }

  // Emit events
  sendMessage(messageData) {
    console.log('🧪 sendMessage called with:', messageData);
    console.log('🧪 Socket exists:', !!this.socket);
    console.log('🧪 Socket connected property:', this.socket ? this.socket.connected : 'No socket');
    console.log('🧪 isConnected property:', this.isConnected);
    
    if (this.socket && this.socket.connected) {
      console.log('🧪 Testing socket connection before sending message...');
      console.log('🧪 Socket connected:', this.socket.connected);
      console.log('🧪 Socket ID:', this.socket.id);
      
      // Test if socket is responsive
      this.socket.emit('test-event', { message: 'Testing before send message' });
      
      console.log('🚀 Sending message via socket:', messageData); // Debug log
      this.socket.emit('send-message', messageData);
      
      // Also emit a test after sending message
      setTimeout(() => {
        console.log('🧪 Testing socket after message send...');
        this.socket.emit('test-event', { message: 'Testing after send message' });
      }, 100);
    } else {
      console.error('❌ Socket not connected when trying to send message');
      console.error('❌ Socket object:', this.socket);
      console.error('❌ Socket connected:', this.socket ? this.socket.connected : 'No socket');
      console.error('❌ isConnected flag:', this.isConnected);
    }
  }

  deleteMessage(messageId) {
    if (this.socket) {
      this.socket.emit('delete-message', messageId);
    }
  }

  editMessage(messageId, content) {
    if (this.socket) {
      this.socket.emit('edit-message', { messageId, content });
    }
  }

  startTyping(recipientId) {
    if (this.socket) {
      console.log('🔤 Sending typing start:', { receiverId: recipientId });
      this.socket.emit('typing-start', { receiverId: recipientId });
    }
  }

  stopTyping(recipientId) {
    if (this.socket) {
      console.log('🔤 Sending typing stop:', { receiverId: recipientId });
      this.socket.emit('typing-stop', { receiverId: recipientId });
    }
  }

  joinUserRoom(userId) {
    if (this.socket) {
      this.socket.emit('joinUserRoom', userId);
    }
  }

  leaveUserRoom(userId) {
    if (this.socket) {
      this.socket.emit('leaveUserRoom', userId);
    }
  }

  // Remove specific event listeners
  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
  }

  // Test connectivity
  testConnection() {
    if (this.socket) {
      console.log('🧪 Testing socket connection...');
      console.log('🧪 Socket connected:', this.socket.connected);
      console.log('🧪 Socket ID:', this.socket.id);
      
      this.socket.emit('test-event', { message: 'Testing connectivity', timestamp: Date.now() });
      
      this.socket.on('test-response', (data) => {
        console.log('✅ Socket test successful:', data);
      });
    } else {
      console.error('❌ Socket not available for testing');
    }
  }

  // Add a specific method to test message sending
  testMessageSend() {
    if (this.socket) {
      console.log('🧪 Testing message send...');
      const testData = {
        content: 'Test message',
        receiverId: '68aa27625edabf840fc582b0', // Use the actual receiver ID from your log
        messageType: 'text'
      };
      
      console.log('🧪 Sending test message:', testData);
      this.socket.emit('send-message', testData);
      
      // Listen for the response
      this.socket.once('message-received', (data) => {
        console.log('✅ Test message response received:', data);
      });
    }
  }
}

// Create and export a singleton instance
const socketService = new SocketService();

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.socketService = socketService;
}

export default socketService;
