import { motion } from "framer-motion";

// A fixed map (not motion[tag]) so components are never created during render.
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  ul: motion.ul,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

// getMotionTag(tag) | out: motion component, falls back to motion.div for unsupported tags
export const getMotionTag = (tag) => MOTION_TAGS[tag] ?? motion.div;