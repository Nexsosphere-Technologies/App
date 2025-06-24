/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          red: 'var(--color-primary)',
          'red-dark': 'var(--color-primary-dark)',
          'red-light': 'var(--color-primary-light)',
        },
        dark: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
        },
        theme: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          primary: 'var(--color-primary)',
          'primary-dark': 'var(--color-primary-dark)',
          'primary-light': 'var(--color-primary-light)',
        }
      },
      animation: {
        'bounce-subtle': 'bounce 2s infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'theme-transition': 'themeTransition 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.5s ease-out forwards',
        'rotate-in': 'rotateIn 0.8s ease-out forwards',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(40) forwards',
        'blink': 'blink 1s infinite',
        'ripple': 'ripple 0.6s ease-out',
        'confetti': 'confetti 3s ease-out forwards',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'morphing': 'morphing 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'loading-dots': 'loading-dots 1.4s ease-in-out infinite',
      },
      keyframes: {
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px var(--color-primary)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 20px var(--color-primary), 0 0 30px var(--color-primary)',
            transform: 'scale(1.02)',
          },
        },
        wiggle: {
          '0%, 7%, 100%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(-3deg)' },
          '20%': { transform: 'rotate(3deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '30%': { transform: 'rotate(3deg)' },
          '35%': { transform: 'rotate(-1deg)' },
          '40%': { transform: 'rotate(1deg)' },
          '50%, 100%': { transform: 'rotate(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        slideInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        fadeInScale: {
          from: {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        rotateIn: {
          from: {
            opacity: '0',
            transform: 'rotate(-180deg) scale(0.5)',
          },
          to: {
            opacity: '1',
            transform: 'rotate(0deg) scale(1)',
          },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        typewriter: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        morphing: {
          '0%, 100%': { borderRadius: '20px' },
          '25%': { borderRadius: '50px' },
          '50%': { borderRadius: '10px' },
          '75%': { borderRadius: '30px' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'loading-dots': {
          '0%, 20%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-area-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};