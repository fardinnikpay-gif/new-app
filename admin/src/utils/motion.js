export const DURATION = 0.15;
export const OFFSET = 8;

// Returns a framer-motion transition; zero duration when reduced motion is on.
export const getTransition = (reduceMotion) => ({
  duration: reduceMotion ? 0 : DURATION,
  ease: "easeOut",
});