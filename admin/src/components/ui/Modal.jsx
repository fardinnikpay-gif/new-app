import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useOverlay from "../../hooks/useOverlay";
import { cx } from "../../utils/cx";
import { OFFSET, getTransition } from "../../utils/motion";
import OverlayHeader from "./OverlayHeader";

const SIZES = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-3xl" };

export default function Modal({ open, onClose, title, children, size = "md" }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const transition = getTransition(useReducedMotion());

  useOverlay(open, dialogRef, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cx(
              "relative flex max-h-full w-full flex-col rounded-lg bg-white shadow-overlay outline-none",
              SIZES[size]
            )}
            initial={{ opacity: 0, y: OFFSET }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: OFFSET }}
            transition={transition}
          >
            <OverlayHeader title={title} titleId={titleId} onClose={onClose} />
            <div className="overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}