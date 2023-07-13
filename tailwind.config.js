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
      background: {
        "silly-color": "yellow",
      },
      fontSize: {
        "fluid-s": "clamp(0.7rem, 1vw, 1rem)",
        "fluid-m": "clamp(1rem, 1.5vw, 1.4rem)",
        "fluid-l": "clamp(1.5rem, 3vw, 2.7rem)",
      },
    },
  },
  plugins: [],
};
