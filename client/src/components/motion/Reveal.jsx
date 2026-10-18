
import { useReducedMotion, motion } from "framer-motion";
import { OFFSET, VIEWPORT, fadeUp } from "../../animations/variants";

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

const PLAIN_TAGS = {
  div: "div",
  section: "section",
  article: "article",
  header: "header",
  footer: "footer",
  ul: "ul",
  li: "li",
  p: "p",
  span: "span",
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

function RevealMotion({ as = "div", delay, y, className, children, ...rest }) {
  const MotionTag = MOTION_TAGS[as] ?? motion.div;

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

export default function Reveal({
  as = "div",
  delay = 0,
  y = OFFSET.y,
  className,
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = PLAIN_TAGS[as] ? as : "div";

    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <RevealMotion
      as={as}
      delay={delay}
      y={y}
      className={className}
      {...rest}
    >
      {children}
    </RevealMotion>
  );
}
