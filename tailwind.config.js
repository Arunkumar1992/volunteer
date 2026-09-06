/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        },
        steam: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          amber: '#f59e0b',
          blue: '#3b82f6',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
