/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0C3A7A',
        'primary-light': '#1572E8',
      }
    },
  },
  plugins: [],
}