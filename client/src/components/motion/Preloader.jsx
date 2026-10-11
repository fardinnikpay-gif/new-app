import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "../../animations/variants";
import useScrollLock from "../../hooks/useScrollLock";
import { safeSessionGet, safeSessionSet } from "../../utils/storage";

const SEEN_KEY = "preloader:seen";
const VISIBLE_MS = 900;
const PROGRESS_SECONDS = 0.7;
const EXIT_SECONDS = 0.5; // total stays under 1.5s

// Short intro curtain, only the first time in a browser session. Skipped with prefers-reduced-motion.
export default function Preloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => !safeSessionGet(SEEN_KEY));
  const active = visible && !reduceMotion;

  useScrollLock(active);

  useEffect(() => {
    if (!visible) return undefined;
    safeSessionSet(SEEN_KEY, true);
    const timer = window.setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="preloader"
          aria-hidden="true"
          className="fixed inset-0 z-[60] grid place-items-center bg-ink text-surface"
          exit={{ y: "-100%" }}
          transition={{ duration: EXIT_SECONDS, ease: EASE.inOut }}
        >
          <div className="w-48 space-y-4 text-center">
            <p className="text-2xl font-light tracking-tight">{import.meta.env.VITE_SITE_NAME}</p>
            <div className="h-px w-full bg-surface/20">
              <motion.div
                className="h-full origin-left bg-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: PROGRESS_SECONDS, ease: EASE.inOut }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}