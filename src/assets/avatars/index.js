// Avatar management system
const avatars = [
  {
    id: 1,
    name: 'Emma',
    src: '/avatars/avatar1.png', // Orange hair woman
    color: '#FF8A65'
  },
  {
    id: 2,
    name: 'James',
    src: '/avatars/avatar2.png', // Business man with beard
    color: '#5C6BC0'
  },
  {
    id: 3,
    name: 'Alex',
    src: '/avatars/avatar3.png', // Clean man with blue shirt
    color: '#42A5F5'
  },
  {
    id: 4,
    name: 'Marcus',
    src: '/avatars/avatar4.png', // Man with glasses and green shirt
    color: '#66BB6A'
  }
];

// Function to get random avatar
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

// Function to get avatar by user ID (consistent avatar per user)
export const getAvatarByUserId = (userId) => {
  if (!userId) return getRandomAvatar();
  
  // Create a simple hash from userId to ensure same user gets same avatar
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % avatars.length;
  return avatars[index];
};

// Function to get initials from name or phone
export const getInitials = (name, phone) => {
  if (name && name.trim()) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  if (phone) {
    return phone.slice(-2);
  }
  return 'U';
};

export default avatars;
