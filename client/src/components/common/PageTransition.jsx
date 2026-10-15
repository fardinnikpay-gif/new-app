import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { transitions } from "../../utils/motion";

// Account sub-pages share one layout, so they must not remount on every tab change.
const getTransitionKey = (pathname) => (pathname.startsWith("/account") ? "/account" : pathname);

// Fade-in only (no exit): with an exit animation the scroll-to-top would make the old page
// jump while it is still fading out. Opacity only, so pinned elements are not affected.
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <motion.div
      key={getTransitionKey(pathname)}
      initial={isFirstRender.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transitions.fast}
    >
      {children}
    </motion.div>
  );
}