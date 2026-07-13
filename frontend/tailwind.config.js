/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VisionMirror Brand Palette
        brand: {
          cream:    '#F5F0E8',
          beige:    '#E8DDD0',
          warm:     '#D4C4A8',
          tan:      '#C4A882',
          gold:     '#B8956A',
          bronze:   '#9A7A55',
          mocha:    '#7A5C3A',
          espresso: '#5C3D1E',
          dark:     '#2C1810',
        },
        surface: {
          light:  '#FAF8F5',
          card:   '#F0EBE3',
          overlay:'rgba(44, 24, 16, 0.85)',
        },
        accent: {
          gold:    '#C4963D',
          success: '#4CAF50',
          error:   '#E53935',
          info:    '#1976D2',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft':   '0 2px 15px -3px rgba(92,61,30,0.1), 0 4px 6px -2px rgba(92,61,30,0.05)',
        'card':   '0 4px 24px -4px rgba(92,61,30,0.15)',
        'glow':   '0 0 20px rgba(196,150,61,0.4)',
        'inner-soft': 'inset 0 2px 8px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #5C3D1E 0%, #9A7A55 50%, #C4A882 100%)',
        'gradient-warm':  'linear-gradient(180deg, #F5F0E8 0%, #E8DDD0 100%)',
        'gradient-hero':  'linear-gradient(135deg, #2C1810 0%, #5C3D1E 40%, #9A7A55 100%)',
        'gradient-card':  'linear-gradient(145deg, #FAF8F5, #F0EBE3)',
        'gradient-gold':  'linear-gradient(135deg, #C4963D, #B8956A)',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-in-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'slide-down':   'slideDown 0.4s ease-out',
        'slide-left':   'slideLeft 0.4s ease-out',
        'slide-right':  'slideRight 0.4s ease-out',
        'scale-in':     'scaleIn 0.3s ease-out',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'shimmer':      'shimmer 1.5s infinite',
        'spin-slow':    'spin 3s linear infinite',
        'bounce-soft':  'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(196,150,61,0.3)' },
          '50%':       { boxShadow: '0 0 25px rgba(196,150,61,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      screens: {
        'xs': '375px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
