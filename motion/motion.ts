import { Transition, Variants } from 'framer-motion';

export const smoothFadeUp: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
    willChange: "transform"
  },
};

export const fadeUpItem: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothFadeUp,
    willChange: "opacity, transform"
  },
};

export const slowFloatTransition: Transition = {
  duration: 10,
  ease: [0.22, 1, 0.36, 1],
  repeat: Infinity,
  repeatType: 'reverse',
};

export const floatVariants: Variants = {
  hidden: { y: -8, opacity: 0.45, scale: 0.98 },
  visible: {
    y: 8,
    opacity: 0.9,
    scale: 1,
    transition: slowFloatTransition,
    willChange: "opacity, transform"
  },
};