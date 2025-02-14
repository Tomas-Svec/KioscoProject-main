/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class', // ✅ Habilita el modo oscuro basado en clases
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
