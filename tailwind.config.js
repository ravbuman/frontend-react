/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Primary lavender/purple colors
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
        // Secondary magenta colors
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
        },
        // Lavender theme colors
        lavender: {
          50: '#f8f7ff',
          100: '#f0edff',
          200: '#e8e5ff',
          300: '#d4cfff',
          400: '#b8a7ff',
          500: '#9d8df1',
          600: '#8b7ae6',
          700: '#7965d9',
          800: '#6752c7',
          900: '#5540a3',
        },
        // Background colors
        background: {
          primary: '#fefeff',
          secondary: '#f8f7ff',
          accent: '#f0edff',
        },
        // Text colors
        text: {
          primary: '#1f1a2e',
          secondary: '#4a4458',
          muted: '#8b8693',
          light: '#b8b4c1',
        },
        // Border colors
        border: {
          light: '#e8e5ff',
          medium: '#d4cfff',
          dark: '#b8a7ff',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'lavender': '0 1px 3px 0 rgba(139, 95, 242, 0.1), 0 1px 2px 0 rgba(139, 95, 242, 0.06)',
        'lavender-md': '0 4px 6px -1px rgba(139, 95, 242, 0.1), 0 2px 4px -1px rgba(139, 95, 242, 0.06)',
        'lavender-lg': '0 10px 15px -3px rgba(139, 95, 242, 0.1), 0 4px 6px -2px rgba(139, 95, 242, 0.05)',
        'lavender-xl': '0 20px 25px -5px rgba(139, 95, 242, 0.1), 0 10px 10px -5px rgba(139, 95, 242, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-lavender': 'pulseLavender 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseLavender: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

