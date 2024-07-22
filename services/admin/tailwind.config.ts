import type { Config } from "tailwindcss";

export default {
  content: [`${__dirname}/src/**/*.{html,js,ts,jsx,tsx}`],
  theme: {
    extend: {
      fontFamily: {
        customFont: ["Montserrat", "sans-serif"],
      },
      scale: {
        "101": "1.005",
      },
      colors: {
        aqua: "#00CBE0",
        purple: "#640BED",
        yellow: {
          light: "#FFFAED",
          DEFAULT: "#FBD150",
          dark: "#F78326",
        },
        red: {
          light: "#FEF0EC",
          DEFAULT: "#F36E45",
          dark: "#D94326",
        },
        green: {
          light: "#EFF9F0",
          DEFAULT: "#61BE6E",
          dark: "#2F8841",
        },
        blue: {
          sky: "#F4F9FF",
          light: "#E5F0FF",
          DEFAULT: "#006BFA",
          dark: "#1B1CDD",
          water: "#7DD3FC",
        },
        grey: {
          light: "#373A3661",
          DEFAULT: "#373A3699",
          dark: "#373A36",
          body: "#373A36",
          label: "#878986",
          placeholder: "#373A3661",
          border: "#D7DBDE",
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        spin: {
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },
} satisfies Config;
