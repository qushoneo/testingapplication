import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {},

      colors: {
        gray: "#E9E9E9",

        link: "#3276FF",
        textPrimary: "#1A1A1A",
      },
    },
  },
  plugins: [],
} satisfies Config;
