/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6161",
        second: "#FFF0F0",
        hover: "#D2373F",
        iconDefault: "#ACACAC",
        iconHover: "#666666",
        textGray: "#8E8E93",
        phGray: "#ACACAC",
        borderGray: "#E6E6E6",
        detailBorder: "#F9F9F9",
      },
      backgroundImage: {
        landing_bg: "url(/image/landing_background.jpg)",
        profile_gold: "url(/image/profile_grade_gold.png)",
      },
    },
  },

  plugins: [require("tailwind-scrollbar"), require("@tailwindcss/line-clamp")],
};
