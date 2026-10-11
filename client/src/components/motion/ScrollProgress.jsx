import { motion, useScroll } from "framer-motion";

// Thin blue bar at the top of the page. It follows the user's scroll, so it is not an animation (transform only).
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[45] h-0.5 origin-left bg-primary"
      style={{ scaleX: scrollYProgress }}
    />
  );
}