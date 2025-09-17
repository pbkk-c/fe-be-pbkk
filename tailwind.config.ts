import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        info: {
          light: "#7DCEF7",
          main: "#3FACE3",
          hover: "#148CC7",
        },
        success: {
          light: "#7DF7B4",
          main: "#4ADF8D",
          hover: "#36A668",
        },
        warning: {
          light: "#F7E77D",
          main: "#FFE539",
          hover: "#E9CE21",
        },
        danger: {
          light: "#F77D7D",
          main: "#F23737",
          hover: "#AF2D2F",
        },
        typo: {
          white: "#FFFFFF",
          "outline-1": "#808080",
          "outline-2": "#E5E5E6",
          inline: "#959698",
          secondary: "#C7C7C7",
          main: "#232323",
        },
        reeva: {
          main: "#3FACE3",
          "primary-1": "#148CC7",
          "primary-2": "#7DCEF7",
          "secondary-1": "#9C21E9",
          "secondary-2": "#B755F4",
          "secondary-3": "#C87DF7",
          "secondary-4": "#3636A6",
          "secondary-5": "#4A4ADF",
          "secondary-6": "#7D7DF7",
        },
        bst: {
          main: "#4ADF8D",
          "primary-1": "#36A668",
          "primary-2": "#7DF7B4",
          "secondary-1": "#36A6A0",
          "secondary-2": "#2BD4CC",
          "secondary-3": "#7DF7F1",
          "secondary-4": "#7DC714",
          "secondary-5": "#9FE33F",
          "secondary-6": "#C4F77D",
        },
        nlc: {
          main: "#FFE539",
          "primary-1": "#E9CE21",
          "primary-2": "#F7E77D",
          "secondary-1": "#E99C21",
          "secondary-2": "#E4AC52",
          "secondary-3": "#F7C87D",
        },
        npc: {
          main: "#F23737",
          "primary-1": "#AF2D2F",
          "primary-2": "#F77D7D",
          "secondary-1": "#AF2D52",
          "secondary-2": "#FD7FA3",
          "secondary-3": "#FAB2C7",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        inter: ["(var(--font-inter))"],
        Poppins: ["(var(--font-Poppins))"],
        DaggerSquare: ["(var(--font-DaggerSquare))"],
        ArgentumSans: ["(var(--font-ArgentumSans))"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  // plugins: [require("tailwindcss-animate")],
  //   plugins: [],
};
export default config;