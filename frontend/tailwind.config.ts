import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#111111",
        surface: "#1F1F1F",

        primary: "#DCC9A9",
        success: "#4E6851",
        danger: "#B83A2D",

        border: "#2A2A2A",

        text: {
          primary: "#F5F5F5",
          secondary: "#A1A1AA",
        },
      },
    },
  },

  plugins: [],
} satisfies Config;