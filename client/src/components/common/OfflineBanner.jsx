import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import { cx } from "../../utils/cx";
import { transitions } from "../../utils/motion";

const BACK_ONLINE_MS = 2500;

// Shows a banner while offline, and a short "back online" confirmation afterwards.
export default function OfflineBanner() {
  const online = useOnlineStatus();
  const [showBack, setShowBack] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return undefined;
    }
    if (!wasOffline.current) return undefined;

    wasOffline.current = false;
    setShowBack(true);
    const timer = setTimeout(() => setShowBack(false), BACK_ONLINE_MS);
    return () => clearTimeout(timer);
  }, [online]);

  return (
    <AnimatePresence>
      {(!online || showBack) && (
        <motion.div
          role="status"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={transitions.base}
          className={cx(
            "fixed inset-x-0 top-0 z-[90] px-4 py-2 text-center text-sm text-white",
            online ? "bg-green-700" : "bg-ink"
          )}
        >
          {online
            ? "You're back online."
            : "You're offline. Some features may not work until you reconnect."}
        </motion.div>
      )}
    </AnimatePresence>
  );
}