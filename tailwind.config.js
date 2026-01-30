/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ftc-green': '#6ee7b7', // Approximate neon green
        'ftc-dark': '#0f172a',  // Dark slate/black
        'ftc-orange': '#f97316',
        'ftc-blue': '#3b82f6',
        'ftc-purple': '#a855f7',
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        mono: ['"Orbitron"', 'monospace'],
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
