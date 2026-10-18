
import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  TEXT_STAGGER,
  VIEWPORT,
  makeStagger,
  wordReveal,
} from "../../animations/variants";

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

export default function TextReveal({
  text,
  as = "h2",
  stagger = TEXT_STAGGER,
  delay = 0,
  className,
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  if (reduceMotion) {
    const Tag = PLAIN_TAGS[as] ? as : "h2";
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = MOTION_TAGS[as] ?? motion.h2;

  return (
    <MotionTag
      className={className}
      variants={makeStagger(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span variants={wordReveal} className="inline-block">
                {word}
              </motion.span>
            </span>
            {index < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </MotionTag>
  );
}
