import { AnimatePresence, motion } from "framer-motion";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-ring relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[rgba(var(--surface-strong),0.86)] text-main transition duration-300 hover:-translate-y-0.5"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -20, scale: 0.72 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 20, scale: 0.72 }}
          transition={{ duration: 0.26 }}
          className="absolute"
        >
          {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;

