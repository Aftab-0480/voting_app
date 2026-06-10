/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Sora', 'sans-serif'],
    },
    colors: {
      ink: {
        900: '#0D1117',
        800: '#161B22',
        700: '#21262D',
        600: '#30363D',
        500: '#484F58',
      },
      paper: {
        50: '#F6F8FA',
        100: '#EAEEF2',
        200: '#D0D7DE',
      },
      vote: {
        500: '#1D6FE8',
        600: '#1558C0',
        400: '#4A90F5',
      },
      accent: {
        500: '#F0883E',
        400: '#F5A461',
      }
    },
  },
},
  darkMode: 'class',
  plugins: [],
}