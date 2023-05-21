const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "node_modules/nullwind/theme.ts", 
    "src/**/*.{jsx,tsx}",
    "./src/**/*.jsx",
  ],
  theme: {
    extend: {
      // Set font family
      fontFamily: {
        sans: [
          "Inter", 
          ...defaultTheme.fontFamily.sans
        ],
      },
      // Set theme colors (Required config!)
      colors: {
        rosePine: {
          base: "#191724",
          surface: "#1f1d2e",
          overlay: "#26233a",
          muted: "#6e6a86",
          subtle: "#908caa",
          text: "#e0def4",
          love: "#eb6f92",
          gold: "#f6c177",
          rose: "#ebbcba",
          pine: "#31748f",
          foam: "#9ccfd8",
          iris: "#c4a7e7",
          shiny: "#e99a96",
          highlightLow: "#21202e",
          highlightMed: "#403d52",
          highlightHigh: "#524f67",
        },
        primary: colors.pink,
        secondary: colors.gray,
        info: colors.blue,
        success: colors.green,
        warning: colors.orange,
        danger: colors.red,
      },
    },
  },
  // Add plugins
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
