import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../../animations/gsap";
import { DURATION } from "../../animations/variants";
import { useLenis } from "./SmoothScroll";

// Routes inside these areas share one layout and should not
// animate as separate pages.
const SHARED_LAYOUT_PREFIXES = ["/account"];

function getTransitionKey(pathname) {
  const prefix = SHARED_LAYOUT_PREFIXES.find(
    (item) => pathname === item || pathname.startsWith(`${item}/`)
  );

  return prefix ?? pathname;
}

export default function PageTransition({ children }) {
  const location = useLocation();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  const transitionKey = getTransitionKey(location.pathname);

  const handleExitComplete = () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    ScrollTrigger.refresh();
  };

  const handleEntered = () => {
    ScrollTrigger.refresh();
  };

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={handleExitComplete}
    >
      <motion.div
        key={transitionKey}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{
          duration: reduceMotion ? 0 : DURATION.fast,
          ease: "easeOut",
        }}
        onAnimationComplete={handleEntered}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}