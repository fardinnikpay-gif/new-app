import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import useFocusTrap from "../../hooks/useFocusTrap";
import useScrollLock from "../../hooks/useScrollLock";
import { cx } from "../../utils/cx";

const FADE = { duration: 0.15 };
const BACKDROP_TRANSITION = { duration: 0.2 };
const MODAL_TRANSITION = { duration: 0.2, ease: "easeOut" };
const DRAWER_TRANSITION = { type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] };

// kind: "modal" | "left" | "right" . Only opacity and transform are animated.
function getPanelMotion(kind, reduceMotion) {
  if (reduceMotion) {
    return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: FADE };
  }

  if (kind === "left" || kind === "right") {
    const offscreen = kind === "left" ? "-100%" : "100%";
    return {
      initial: { x: offscreen },
      animate: { x: 0 },
      exit: { x: offscreen },
      transition: DRAWER_TRANSITION,
    };
  }

  return {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.98 },
    transition: MODAL_TRANSITION,
  };
}

function OverlayContent({ onClose, title, hideTitle, kind, wrapperClassName, panelClassName, children }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();

  useFocusTrap(panelRef, onClose);

  return (
    <div className={cx("fixed inset-0 z-50", wrapperClassName)}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reduceMotion ? FADE : BACKDROP_TRANSITION}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx("flex flex-col bg-white shadow-lift outline-none", panelClassName)}
        {...getPanelMotion(kind, reduceMotion)}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-2">
          <h2 id={titleId} className={hideTitle ? "sr-only" : "text-lg font-medium"}>
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors hover:bg-neutral-100"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
      </motion.div>
    </div>
  );
}

// props: { open, onClose, title, hideTitle, kind, wrapperClassName, panelClassName, children }
export default function Overlay({ open, ...rest }) {
  useScrollLock(open);

  return createPortal(
    <AnimatePresence>{open && <OverlayContent key="overlay" {...rest} />}</AnimatePresence>,
    document.body
  );
}