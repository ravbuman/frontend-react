import React from 'react';
import { getAvatarByUserId, getInitials } from '../../assets/avatars';

const Avatar = ({ 
  userId, 
  name, 
  phone, 
  size = 'md', 
  className = '',
  showOnlineStatus = false,
  isOnline = false,
  onClick = null 
}) => {
  const avatar = getAvatarByUserId(userId);
  const initials = getInitials(name, phone);
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl'
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    rounded-full overflow-hidden
    bg-gradient-to-br from-gray-100 to-gray-200
    border-2 border-white
    shadow-lg hover:shadow-xl
    transition-all duration-300 ease-in-out
    hover:scale-105
    ${onClick ? 'cursor-pointer' : ''}
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={onClick}>
      {/* Background gradient based on avatar color */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-80"
        style={{
          background: `linear-gradient(135deg, ${avatar.color}20 0%, ${avatar.color}40 100%)`
        }}
      />
      
      {/* Avatar content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Try to show actual avatar image, fallback to initials */}
        <div className="w-full h-full flex items-center justify-center">
          <span 
            className="font-semibold text-gray-700"
            style={{ color: avatar.color }}
          >
            {initials}
          </span>
        </div>
      </div>
      
      {/* Online status indicator */}
      {showOnlineStatus && (
        <div className="absolute -bottom-1 -right-1 z-20">
          <div className={`
            w-3 h-3 rounded-full border-2 border-white
            ${isOnline 
              ? 'bg-green-400 shadow-lg shadow-green-400/50' 
              : 'bg-gray-400'
            }
            transition-all duration-300
          `}>
            {isOnline && (
              <div className="w-full h-full rounded-full bg-green-400 animate-pulse" />
            )}
          </div>
        </div>
      )}
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-full" />
    </div>
  );
};

export default Avatar;
