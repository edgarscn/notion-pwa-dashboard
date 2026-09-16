/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#ffffff',
          darkBg: '#191919',
          sidebar: '#f7f6f3',
          sidebarDark: '#202020',
          hover: '#efeee9',
          hoverDark: '#2c2c2c',
          border: '#e9e9e8',
          borderDark: '#2f2f2f',
          text: '#37352f',
          textDark: '#e3e3e3',
          muted: '#787774',
          mutedDark: '#9b9b9b',
        }
      }
    },
  },
  plugins: [],
};
