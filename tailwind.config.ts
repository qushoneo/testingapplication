import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {},

      colors: {
        gray: '#E9E9E9',
        green: '#00861B',
        red: '#DC0000',
        yellow: '#F8DF3E',
        disabled: '#1A1A1A66',
        secondaryBackground: '#E9E9E9',
        lightgray: '#E9E9E966',
        lightgreen: '#A8DCAB',
        link: '#3276FF',
        textPrimary: '#1A1A1A',
        passed: '#49B14780',
        failed: '#E9434380',
        inProgress: '#6B97D880',
      },
    },
  },
  plugins: [],
} satisfies Config;
