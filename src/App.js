import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatInterface from './components/Chat/ChatInterface';
import './styles/scrollbar.css';

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <header className="bg-white shadow-lavender border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">
                ChatApp
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a href="/login" className="btn-lavender-outline">
                Login
              </a>
              <a href="/register" className="btn-lavender">
                Sign Up
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gradient mb-6 animate-fade-in">
            Welcome to ChatApp
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Connect with friends and family through our beautiful, 
            secure messaging platform with a lovely lavender theme.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="card-lavender p-6 animate-slide-up">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Real-time Messaging</h3>
              <p className="text-text-secondary">
                Instant messaging with real-time delivery and read receipts.
              </p>
            </div>

            <div className="card-lavender p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Secure & Private</h3>
              <p className="text-text-secondary">
                End-to-end encryption ensures your conversations stay private.
              </p>
            </div>

            <div className="card-lavender p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-lavender-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-lavender-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Group Chats</h3>
              <p className="text-text-secondary">
                Create groups and chat with multiple friends at once.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 card-lavender p-8">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Ready to start chatting?
            </h3>
            <p className="text-text-secondary mb-6">
              Join thousands of users who trust ChatApp for their daily conversations.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/register" className="btn-lavender px-8 py-3 text-lg">
                Get Started
              </a>
              <a href="/login" className="btn-lavender-outline px-8 py-3 text-lg">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border-light mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-text-muted">
              © 2025 ChatApp. Made with ❤️ and lots of lavender.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatProvider>
                    <ChatInterface />
                  </ChatProvider>
                </ProtectedRoute>
              } 
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
