/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050A1A',
          900: '#0A1628',
          800: '#0F2040',
          700: '#1A2E55',
          600: '#243860',
        },
        gold: {
          300: '#FFE566',
          400: '#FFD700',
          500: '#FFC200',
          600: '#E6A800',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-navy':
          'radial-gradient(ellipse at 50% 0%, #1A2E55 0%, #050A1A 70%)',
        'gold-shimmer':
          'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'gold-glow': '0 0 0 2px rgba(255,215,0,0.4), 0 0 20px rgba(255,215,0,0.15)',
        neu: '6px 6px 16px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.03)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'float-bob': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'star-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'float-bob': 'float-bob 3s ease-in-out infinite',
        'star-pulse': 'star-pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
