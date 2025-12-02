/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFFFF',
          1: '#2F2E30',
        },
        secondary: {
          DEFAULT: '#F5F5F5',
          2: '#DB4444',
        },
        text: {
          DEFAULT: '#FAFAFA',
          2: '#000000',
        },
        button: {
          DEFAULT: '#000000',
          1: '#00FF66',
          2: '#DB4444',
        },
        hover: {
          button: '#E07575',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
