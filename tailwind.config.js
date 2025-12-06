/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          200: '#a7c7fa',
          300: '#7dabf7',
          400: '#528ff5',
          500: '#1a73e8',
          600: '#1b66c9',
          700: '#1859aa',
          800: '#0d47a1',
          900: '#174ea6',
        },
        secondary: {
          50: '#e6f4ea',
          100: '#ceead6',
          200: '#a8d5b4',
          300: '#81c092',
          400: '#5fad7f',
          500: '#34a853',
          600: '#2e8b46',
          700: '#277f39',
          800: '#1e6d2d',
          900: '#0d6524',
        },
        accent: {
          50: '#fef7e0',
          100: '#feefc3',
          200: '#fde293',
          300: '#fdd663',
          400: '#eac420',
          500: '#fbbc05',
          600: '#f9ab00',
          700: '#f29900',
          800: '#ea8600',
          900: '#e37400',
        },
      },
      fontFamily: {
        'sans': ['"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 6px 16px rgba(0, 0, 0, 0.1)',
        'header': '0 4px 12px rgba(26, 115, 232, 0.2)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'card': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      }
    },
  },
  plugins: [],
}