import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#fcfaf7",
          100: "#f7f1e8",
          200: "#eadcc9",
          300: "#dbc39f",
          400: "#c59d6c",
          500: "#a66f35",
          600: "#8f5d2b",
          700: "#744923",
          800: "#57361a",
          900: "#372312"
        },
        ink: {
          50: "#f8f8f7",
          100: "#efeeea",
          200: "#ddd8cf",
          300: "#c2b7a7",
          400: "#9d8f7b",
          500: "#746756",
          600: "#584c3f",
          700: "#40352a",
          800: "#2b231c",
          900: "#17120e"
        },
        accent: {
          50: "#eff9ff",
          100: "#dff1ff",
          200: "#b8e2ff",
          300: "#7fc7ff",
          400: "#46a3ff",
          500: "#2277f2",
          600: "#1b5fcb",
          700: "#194ba4",
          800: "#173c7f",
          900: "#132d5a"
        },
        amber: {
          50: "#fff8e9",
          100: "#feefc7",
          200: "#fce090",
          300: "#f9c954",
          400: "#f3ad1f",
          500: "#e38b12",
          600: "#c16a0f",
          700: "#9c4f11",
          800: "#7f3f14",
          900: "#673313"
        }
      },
      boxShadow: {
        paper: "0 12px 30px rgba(44, 33, 20, 0.08)",
        glow: "0 16px 40px rgba(34, 119, 242, 0.12)"
      },
      fontFamily: {
        sans: [
          '"Avenir Next"',
          '"Segoe UI"',
          '"Helvetica Neue"',
          "system-ui",
          "sans-serif"
        ],
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', "Georgia", "serif"],
        mono: ['"SFMono-Regular"', "Consolas", '"Liberation Mono"', "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
