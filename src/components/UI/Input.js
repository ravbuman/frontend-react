import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  className = '',
  type = 'text',
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  const inputClasses = `input-lavender ${error ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
