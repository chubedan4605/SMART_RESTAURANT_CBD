/**
 * Tailwind v3 config — tương đương config/globals.css (Tailwind v4).
 * Dùng file này NẾU dự án của bạn chạy Tailwind v3 (không có @theme inline).
 *
 * Cách dùng: copy file này vào gốc dự án làm `tailwind.config.ts`.
 * Vẫn cần CSS variable trong globals.css (phần :root và .dark).
 */

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic (đổi theo theme qua CSS var)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Brand (theme-invariant)
        gold: "var(--gold)",
        "gold-soft": "var(--gold-soft)",
        ink: "var(--ink)",
        cream: "var(--cream)",
        olive: "var(--olive)",
        burgundy: "var(--burgundy)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xs: "400px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
