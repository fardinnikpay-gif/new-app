import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { DURATION } from "../../animations/variants";
import { useLenis } from "../motion/SmoothScroll";

const SHOW_AFTER_PX = 600;
const SCROLL_TOP_SECONDS = 1.2;
const HIDDEN_SCALE = 0.8;

// Round blue button that appears after scrolling; scrolls back to the top through Lenis when it exists.
export default function BackToTop() {
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => setVisible(latest > SHOW_AFTER_PX));

  const handleClick = () => {
    if (lenis) lenis.scrollTo(0, { duration: SCROLL_TOP_SECONDS });
    else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={handleClick}
          initial={{ opacity: 0, scale: HIDDEN_SCALE }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: HIDDEN_SCALE }}
          transition={{ duration: DURATION.fast }}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-surface shadow-lift transition-colors hover:bg-primary-light md:right-6"
        >
          <ArrowUp aria-hidden="true" className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}