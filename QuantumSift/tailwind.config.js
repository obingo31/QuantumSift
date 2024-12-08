/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for QuantumSift
        primary: {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#006fe6',
          600: '#0055b3',
          700: '#003c80',
          800: '#00234d',
          900: '#000a1a'
        },
        secondary: {
          50: '#f0f9ff',
          100: '#c9ebff',
          200: '#a1ddff',
          300: '#79cfff',
          400: '#51c1ff',
          500: '#29b3ff',
          600: '#1499e6',
          700: '#007fbc',
          800: '#006693',
          900: '#004c6a'
        },
        danger: {
          50: '#ffe6e6',
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#e60000',
          600: '#b30000',
          700: '#800000',
          800: '#4d0000',
          900: '#1a0000'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'quantum': '0 10px 25px rgba(0, 111, 230, 0.2)',
        'quantum-dark': '0 10px 25px rgba(0, 111, 230, 0.4)',
      },
      borderRadius: {
        'quantum': '0.75rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1a202c',
            a: {
              color: '#006fe6',
              '&:hover': {
                color: '#0055b3',
              },
            },
          },
        },
        dark: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#4da3ff',
              '&:hover': {
                color: '#1a89ff',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide')
  ],
  darkMode: 'class',
}
