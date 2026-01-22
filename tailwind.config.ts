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
        sans: ["var(--font-jetbrains-mono)", "monospace"],
        display: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Cyberpunk neon colors
        neon: {
          cyan: "#00FFFF",
          magenta: "#FF00FF",
          purple: "#BF00FF",
          pink: "#FF1493",
          blue: "#00BFFF",
        },
        cyber: {
          dark: "#0a0a0f",
          darker: "#050508",
          surface: "#12121a",
          border: "#1a1a2e",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 5px #00FFFF, 0 0 20px #00FFFF, 0 0 40px #00FFFF",
        "neon-cyan-sm": "0 0 5px #00FFFF, 0 0 10px #00FFFF",
        "neon-magenta": "0 0 5px #FF00FF, 0 0 20px #FF00FF, 0 0 40px #FF00FF",
        "neon-magenta-sm": "0 0 5px #FF00FF, 0 0 10px #FF00FF",
        "neon-purple": "0 0 5px #BF00FF, 0 0 20px #BF00FF, 0 0 40px #BF00FF",
        "neon-purple-sm": "0 0 5px #BF00FF, 0 0 10px #BF00FF",
        "glow-cyan": "0 0 10px rgba(0, 255, 255, 0.5)",
        "glow-magenta": "0 0 10px rgba(255, 0, 255, 0.5)",
        "glow-purple": "0 0 10px rgba(191, 0, 255, 0.5)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
        flicker: "flicker 0.15s infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF",
          },
          "50%": {
            boxShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF",
          },
        },
        "border-glow": {
          "0%, 100%": {
            borderColor: "#00FFFF",
            boxShadow: "0 0 5px #00FFFF",
          },
          "33%": {
            borderColor: "#FF00FF",
            boxShadow: "0 0 5px #FF00FF",
          },
          "66%": {
            borderColor: "#BF00FF",
            boxShadow: "0 0 5px #BF00FF",
          },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
        "gradient-neon":
          "linear-gradient(90deg, #00FFFF, #BF00FF, #FF00FF)",
        "gradient-neon-vertical":
          "linear-gradient(180deg, #00FFFF, #BF00FF, #FF00FF)",
      },
      backgroundSize: {
        grid: "50px 50px",
      },
    },
  },
  plugins: [],
};
export default config;
