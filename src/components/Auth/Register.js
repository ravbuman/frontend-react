import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    pin: '',
    confirmPin: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }
    
    if (!formData.pin) {
      errors.pin = 'PIN is required';
    } else if (!/^[0-9]{4}$/.test(formData.pin)) {
      errors.pin = 'PIN must be exactly 4 digits';
    }
    
    if (!formData.confirmPin) {
      errors.confirmPin = 'Please confirm your PIN';
    } else if (formData.pin !== formData.confirmPin) {
      errors.confirmPin = 'PINs do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Format phone number as user types
    if (name === 'phoneNumber') {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '');
      // Format as (XXX) XXX-XXXX
      let formatted = digits;
      if (digits.length >= 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      } else if (digits.length >= 3) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      }
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else if (name === 'pin' || name === 'confirmPin') {
      // Only allow 4 digits for PIN
      const digits = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prev => ({
        ...prev,
        [name]: digits
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear confirm PIN error if PINs now match
    if (name === 'pin' && formData.confirmPin && value === formData.confirmPin) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPin: ''
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

    // Convert formatted phone number back to digits only for API
    const { confirmPin, ...registerData } = formData;
    registerData.phoneNumber = registerData.phoneNumber.replace(/\D/g, '');
    
    const result = await register(registerData);
    
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to ChatApp! Redirecting to chat...',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate('/chat');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: result.error || 'Could not create account. Please try again.',
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
            Join ChatApp
          </h1>
          <p className="text-text-secondary">
            Create your account and start chatting
          </p>
        </div>

        {/* Register Form */}
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

            {/* Username Input */}
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={validationErrors.username}
              placeholder="Choose a username"
              required
              autoComplete="username"
            />

            {/* Phone Number Input */}
            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={validationErrors.phoneNumber}
              placeholder="(555) 123-4567"
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
              placeholder="Create a 4-digit PIN"
              required
              autoComplete="new-password"
              maxLength="4"
            />

            {/* Confirm PIN Input */}
            <Input
              label="Confirm PIN"
              type="password"
              name="confirmPin"
              value={formData.confirmPin}
              onChange={handleChange}
              error={validationErrors.confirmPin}
              placeholder="Confirm your PIN"
              required
              autoComplete="new-password"
              maxLength="4"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
