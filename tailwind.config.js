/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './nav-bar/*.html',
    './nav-bar/*.js',
    './css-and-js/*.js',
    './js/*.js',
    './portfolio/*.html',
    './posts/**/*.html',
    './resources/*.html',
    './Private/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'brand-green': '#a7e169',
        'brand-red': '#ed2939',
      },
    },
  },
  plugins: [],
}
