const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["node_modules/nullwind/theme.ts", "src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      // Set font family
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      // Set theme colors (Required config!)
      colors: {
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