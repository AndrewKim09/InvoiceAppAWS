/**@type {import('tailwindcss').Config}*/
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode:'class', // or 'media' or 'class
  theme: {
    extend: {
      colors:{
        purple: "#7C5DFA",
        lightPurple: "#9277FF",
        black1: "#0C0E16",
        black2: "#141625",
        black3: "#1E2139",
        black4: "#252945",
        grey: "#888EB0",
        lightGrey: "#DFE3FA",
        greyBlue: "#7E88C3",
        red: "#EC5757",
        lightRed: "39277FF",
        light: "#F8F8FB",
      }
      
    },
  },
  plugins: [],
}