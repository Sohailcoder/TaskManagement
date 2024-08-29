/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(345deg, #000 0.39%, rgba(2, 2, 10, 0.64) 137.26%, #000 137.26%)',
        'modal': 'rgb(11, 11, 13)',

      },
    },
  },
  plugins: [],
}