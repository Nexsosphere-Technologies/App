/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#ef4444',
          'red-dark': '#dc2626',
          'red-light': '#f87171',
        },
        dark: {
          bg: '#0f0f0f',
          card: '#1a1a1a',
          border: '#262626',
          text: '#fafafa',
          'text-secondary': '#a3a3a3',
        }
      },
      animation: {
        'bounce-subtle': 'bounce 2s infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};