import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F2137",
          50: "#F2F5F8",
          100: "#E2E9EF",
          200: "#C3D1DE",
          300: "#93A9C0",
          400: "#5C7999",
          500: "#365777",
          600: "#264361",
          700: "#1B324A",
          800: "#132437",
          900: "#0F2137",
          950: "#081420",
        },
        steel: {
          DEFAULT: "#2C5AA0",
          50: "#EEF3FA",
          100: "#DCE7F5",
          200: "#B4CBE9",
          300: "#8CAFDC",
          400: "#5B8AC9",
          500: "#2C5AA0",
          600: "#234A85",
          700: "#1C3A69",
          800: "#152B4E",
          900: "#0E1D34",
        },
        mist: {
          50: "#F7F9FA",
          100: "#EFF2F5",
          200: "#E2E7EC",
          300: "#CBD3DB",
          400: "#9BA8B5",
          500: "#6B7A8A",
          600: "#4F5C6B",
          700: "#3A4451",
          800: "#262E38",
          900: "#161B22",
        },
        wave: {
          light: "#6FA8D8",
          DEFAULT: "#3D7CB8",
          dark: "#1F4E80",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        rise: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        wave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        rise: "rise 0.4s ease-out both",
        wave: "wave 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
