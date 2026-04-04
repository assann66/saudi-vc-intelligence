import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        navy: {
          DEFAULT: "#1E3A5F",
          light: "#2A4F7F",
          dark: "#152B47",
        },
        emerald: {
          400: "#2ECC71",
          500: "#27AE60",
          600: "#1E8449",
        },
        gold: {
          400: "#F5B041",
          500: "#F39C12",
          600: "#D68910",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
        },
        amber: {
          400: "#F5B041",
          500: "#F39C12",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Tajawal", "system-ui", "sans-serif"],
        heading: ["Cairo", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
