/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
      },
      colors: {
        brandYellow: '#FFCC00',
        brandDark: '#1A2238', 
        brandBlue: '#2563EB',
        brandRed: '#EF4444',
        brandLightBg: '#F8FAFC', 
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}