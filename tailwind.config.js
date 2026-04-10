/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        'bridge-bg': '#0D0D0D',
        'bridge-dark': '#1E2026',
        'bridge-gray': '#2E2E2E',
        'bridge-sky': '#5493F7',
        'bridge-white': '#FFFFFF',
        'bridge-red': '#d65745',
      },
      fontFamily: {
        gotham: ['Gotham', 'sans-serif'],
      },
      borderRadius: {
        bridge: '15px',
      },
      keyframes: {
        dropdown: {
          '0%': { opacity: '0', marginBottom: '0' },
          '100%': { marginBottom: '-40px', opacity: '1' },
        },
      },
      animation: {
        dropdown: 'dropdown 0.3s ease',
      },
    },
  },
  plugins: [],
}
