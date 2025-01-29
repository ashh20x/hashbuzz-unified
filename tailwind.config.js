/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using a class
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        dimgrey: "#696969",
        palatinateblue: "#2546EB",
        turmericroot: "#FDAF0D",
        blackviolet: "#2C2A44",
        silk: "#F3F3F3",
        waiting: "#9D9D9D",
        mawhite: "#F6F7FE",
        shadow: "rgba(193, 193, 193, 0.25)",
        white: "#fff",
        black: "#000",
        // Dark mode colors
        dark: {
          dimgrey: "#969696",
          palatinateblue: "#EB2546",
          turmericroot: "#0DFDAF",
          blackviolet: "#442A2C",
          silk: "#0C0C0C",
          waiting: "#626262",
          mawhite: "#0A0B12",
          shadow: "rgba(62, 62, 62, 0.75)",
          white: "#000",
          black: "#fff",
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        small: "1em",
        medium: "2em",
        large: "3em",
      },
    },
  },
  plugins: [],
}
