// tailwind.config.js
module.exports = {
  darkMode: 'class', // use class-based toggling
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // your custom colors
        brand: {
          light: '#f00',
          dark: '#1e1e2f',
          accent: '#4ade80',
          textDark: '#d1d5db',
        },
      },
    },
  },
  plugins: [],
};
