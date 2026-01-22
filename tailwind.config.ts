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
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Cream minimal palette
        cream: {
          DEFAULT: "#FAF7F2",
          dark: "#F0EDE6",
        },
        border: {
          DEFAULT: "#E0DDD6",
          dark: "#C4C0B8",
        },
        text: {
          DEFAULT: "#1a1a1a",
          muted: "#666666",
        },
        charcoal: {
          DEFAULT: "#333333",
          light: "#555555",
        },
        selection: "#E8E4DC",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.08)",
        card: "0 2px 8px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
