export const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
  },
};

export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerGrid = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const productCardReveal = {
  hidden: { opacity: 0, y: 20 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      delay: Math.min(index * 0.08, 0.48),
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};
