import { useReducedMotion } from "framer-motion";
import { getMotionTag } from "../../animations/motionTags";
import { OFFSET, VIEWPORT, fadeUp } from "../../animations/variants";

// props: { as, delay, y, className, children, ...rest } | fades up once when it enters the viewport
// With prefers-reduced-motion it renders a plain element (content visible immediately).
export default function Reveal({ as = "div", delay = 0, y = OFFSET.y, className, children, ...rest }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = getMotionTag(as);

  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      custom={{ delay, y }}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}