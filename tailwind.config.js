/** @type {import('tailwindcss').Config} */
module.exports = {
  // O Tailwind vai procurar classes CSS nestes ficheiros
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Inclui App.tsx e SistemaCopia.tsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}