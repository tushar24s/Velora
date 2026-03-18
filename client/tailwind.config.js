/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        display: ["'Inter Tight'", "'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 64px -32px rgba(32, 24, 18, 0.28)",
        glow: "0 14px 40px -20px rgba(134, 97, 72, 0.35)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(248, 239, 228, 0.95), transparent 42%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.86), transparent 36%), radial-gradient(circle at 50% 100%, rgba(232, 216, 198, 0.68), transparent 36%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(146, 116, 90, 0.16), transparent 42%), radial-gradient(circle at 85% 20%, rgba(83, 71, 61, 0.14), transparent 36%), radial-gradient(circle at 50% 100%, rgba(214, 183, 154, 0.08), transparent 34%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.82" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
