import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#EBE6DB",
          accent: "#E5DFD3",
        },
        border: {
          DEFAULT: "#0a0a0a",
          light: "#d4cfc4",
        },
        text: {
          DEFAULT: "#0a0a0a",
          muted: "#5a5a5a",
        },
        charcoal: {
          DEFAULT: "#0a0a0a",
          light: "#2a2a2a",
        },
        selection: "#0a0a0a",
        accent: "#8B4513",
        success: "#2d5a27",
        danger: "#8b2020",
      },
      boxShadow: {
        brutal: "4px 4px 0 #0a0a0a",
        "brutal-sm": "2px 2px 0 #0a0a0a",
        "brutal-lg": "6px 6px 0 #0a0a0a",
      },
      animation: {
        "slide-in": "slide-in 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
