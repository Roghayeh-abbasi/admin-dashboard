/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'], // اضافه کردن scss
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'iran-yekan': ['iran_yekan', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f8ff',
          100: '#e6f3ff',
          200: '#c3e6ff',
          300: '#99d6ff',
          400: '#66c2ff',
          500: '#40adff',
          600: '#3399e6',
          700: '#2677cc',
          800: '#1a5fb3',
          900: '#0f4780',
        },
        danger: {
          50: '#fff5f5',
          100: '#ffeaea',
          200: '#ffd4d4',
          300: '#ffb3b3',
          400: '#ff9999',
          500: '#ff8080',
          600: '#e66666',
          700: '#cc4d4d',
          800: '#b33333',
          900: '#801a1a',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: {
          400: '#86efac',
          500: '#4ade80',
          600: '#22c55e',
        },
      },
    },
  },
  plugins: [],
};