import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { transitions } from "../../utils/motion";

const getTransitionKey = (pathname) =>
  pathname.startsWith("/account") ? "/account" : pathname;

export default function PageTransition({ children }) {
  const { pathname } = useLocation();

  return (
    <motion.div
      key={getTransitionKey(pathname)}
      initial={false}
      animate={{ opacity: 1 }}
      transition={transitions.fast}
    >
      {children}
    </motion.div>
  );
}
