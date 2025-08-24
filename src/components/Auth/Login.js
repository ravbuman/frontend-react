import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';
import Swal from 'sweetalert2';

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    pin: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.pin) {
      errors.pin = 'PIN is required';
    } else if (!/^\d{4}$/.test(formData.pin)) {
      errors.pin = 'PIN must be exactly 4 digits';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number input
    if (name === 'phoneNumber') {
      // Remove all non-digit characters except +
      const cleanValue = value.replace(/[^\d+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
    } else if (name === 'pin') {
      // Only allow digits for PIN, max 4 characters
      const cleanValue = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Login successful! Redirecting to chat...',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate('/chat');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: result.error || 'Invalid phone number or PIN',
        confirmButtonColor: '#8B5CF6'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in with your phone number and PIN
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Global Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Phone Number Input */}
            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={validationErrors.phoneNumber}
              placeholder="Enter your phone number"
              required
              autoComplete="tel"
            />

            {/* PIN Input */}
            <Input
              label="PIN"
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              error={validationErrors.pin}
              placeholder="Enter your 4-digit PIN"
              required
              maxLength="4"
              autoComplete="current-password"
              helperText="Enter your 4-digit PIN"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            Demo: Use phone number 1234567890 and PIN 1234 to test
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
