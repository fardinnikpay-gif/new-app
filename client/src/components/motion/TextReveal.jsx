import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getMotionTag } from "../../animations/motionTags";
import { TEXT_STAGGER, VIEWPORT, makeStagger, wordReveal } from "../../animations/variants";

// props: { text, as, stagger, delay, className } | words rise out of a mask, one after another
// Screen readers read the sr-only full text; the animated words are aria-hidden.
export default function TextReveal({ text, as = "h2", stagger = TEXT_STAGGER, delay = 0, className }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = getMotionTag(as);
  const words = text.split(/\s+/).filter(Boolean);

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