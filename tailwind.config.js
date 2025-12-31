/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        signature: ['"Dancing Script"', '"Great Vibes"', '"Allura"', '"Satisfy"', '"Pacifico"', 'cursive'],
      },
    },
  },
  plugins: [],
};
