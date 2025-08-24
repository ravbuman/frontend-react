import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`${sizeClass} ${className}`}>
      <div className="spinner w-full h-full"></div>
    </div>
  );
};

export default LoadingSpinner;
