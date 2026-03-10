/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0f0d0b',
          50: '#faf9f7',
          100: '#f0ede8',
          200: '#ddd8cf',
          300: '#c4bbb0',
          400: '#a89990',
          500: '#8c7b72',
          600: '#6e5f58',
          700: '#544840',
          800: '#3a302a',
          900: '#241e19',
          950: '#0f0d0b',
        },
        gold: {
          DEFAULT: '#c9a84c',
          50: '#fdf8ec',
          100: '#f8edcc',
          200: '#f0d98a',
          300: '#e8c35e',
          400: '#c9a84c',
          500: '#b08a30',
          600: '#8c6a22',
          700: '#6a4e1a',
          800: '#4a3612',
          900: '#2e210b',
        },
        cream: '#faf8f4',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        'fade-in': 'fade-in 0.4s ease forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
