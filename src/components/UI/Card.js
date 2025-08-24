import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'card-lavender';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverClasses = hover ? 'hover:shadow-lavender-lg hover:-translate-y-1 cursor-pointer' : '';
  const paddingClass = paddingClasses[padding] || paddingClasses.md;

  return (
    <div
      className={`${baseClasses} ${paddingClass} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
