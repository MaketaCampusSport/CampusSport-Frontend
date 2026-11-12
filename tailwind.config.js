/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brandYellow: '#FFCC00', // Galbenul din prototip
        brandDark: '#13151A',   // Bleumarinul foarte închis din sidebar
        brandBlue: '#2563EB',
        brandRed: '#EF4444',
        brandGray: '#F8FAFC',   // Fundalul paginilor de admin
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}