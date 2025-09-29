/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./index.html",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
    DEFAULT: "1rem",    // Mobile: 16px padding 2 bên
    sm: "1.5rem",       // Small: 24px padding 2 bên  
    lg: "2rem",         // Large: 32px padding 2 bên
    xl: "3rem",         // XL: 48px padding 2 bên
    "2xl": "4rem",      // 2XL: 64px padding 2 bên
  },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        health: {
          green: "hsl(var(--health-green))",
          blue: "hsl(var(--health-blue))",
          orange: "hsl(var(--health-orange))",
          purple: "hsl(var(--health-purple))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-wellness": "var(--gradient-wellness)",
        "gradient-sky": "var(--gradient-sky)",
        "gradient-vitality": "var(--gradient-vitality)",
        "gradient-calm": "var(--gradient-calm)",
        "weather-card": "var(--weather-bg)",
        "tip-card": "var(--tip-bg)",
      },
      boxShadow: {
        card: "var(--card-shadow)",
        weather: "var(--weather-shadow)",
        tip: "var(--tip-shadow)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "slide-in-up": {
          from: {
            transform: "translateY(30px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "scale-in": {
          from: {
            transform: "scale(0.95)",
            opacity: "0",
          },
          to: {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "bounce-gentle": {
          "0%, 20%, 53%, 80%, 100%": {
            transform: "translateX(0)",
          },
          "40%, 43%": {
            transform: "translateX(-5px)",
          },
          "70%": {
            transform: "translateX(-3px)",
          },
          "90%": {
            transform: "translateX(-1px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.6s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "bounce-gentle": "bounce-gentle 0.6s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
