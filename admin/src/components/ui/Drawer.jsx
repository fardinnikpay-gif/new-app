import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useOverlay from "../../hooks/useOverlay";
import { cx } from "../../utils/cx";
import { getTransition } from "../../utils/motion";
import OverlayHeader from "./OverlayHeader";

const SIDES = {
  right: { position: "right-0", offscreen: "100%" },
  left: { position: "left-0", offscreen: "-100%" },
};
const SIZES = { sm: "max-w-xs", md: "max-w-md", lg: "max-w-xl" };

export default function Drawer({ open, onClose, title, children, side = "right", size = "md" }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const transition = getTransition(useReducedMotion());
  const { position, offscreen } = SIDES[side];

  useOverlay(open, panelRef, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cx(
              "absolute inset-y-0 flex w-full flex-col bg-white shadow-overlay outline-none",
              position,
              SIZES[size]
            )}
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={transition}
          >
            <OverlayHeader title={title} titleId={titleId} onClose={onClose} />
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}