import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

const SPRING = { type: "spring", stiffness: 260, damping: 18 };
const RING = { duration: 1.2, ease: "easeOut" };

// Success badge: only scale/opacity are animated.
export default function SuccessMark() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-20 w-20 items-center justify-center" aria-hidden="true">
      {!reduceMotion && (
        <motion.span
          className="absolute inset-0 rounded-full bg-primary"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={RING}
        />
      )}
      <motion.span
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white"
        initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING}
      >
        <Check className="h-10 w-10" />
      </motion.span>
    </div>
  );
}