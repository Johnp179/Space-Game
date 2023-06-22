const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/game/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: () => ({
        sans: ["var(--font-roboto)", ...fontFamily.sans],
      }),
      backgroundImage: {
        "home-background": "url('/images/background.svg')",
      },
    },
  },
  plugins: [],
};
