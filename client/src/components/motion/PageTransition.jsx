import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../../animations/gsap";
import { DURATION } from "../../animations/variants";
import { useLenis } from "./SmoothScroll";

// props: { children } | children must be <Routes location={location}> so the leaving page keeps its old route.
// Opacity only: a transform on this wrapper would break position: fixed and ScrollTrigger pins inside pages.
export default function PageTransition({ children }) {
  const location = useLocation();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  // Scroll to top only after the old page is fully hidden, so the user never sees a jump.
  const handleExitComplete = () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  };

  const handleEntered = () => ScrollTrigger.refresh();

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : DURATION.fast, ease: "easeOut" }}
        onAnimationComplete={handleEntered}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}