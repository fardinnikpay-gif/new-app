import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const SCROLLED_AFTER_PX = 24;
const HIDE_AFTER_PX = 160;
const MIN_DELTA_PX = 6; // ignore tiny scroll movements (trackpad noise)

// useHeaderScroll() | out: { scrolled, hidden } , hidden = scrolling down past HIDE_AFTER_PX
export default function useHeaderScroll() {
  const { scrollY } = useScroll();
  const previousRef = useRef(0);
  const [state, setState] = useState({ scrolled: false, hidden: false });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - previousRef.current;
    const movedEnough = Math.abs(delta) >= MIN_DELTA_PX;
    if (movedEnough) previousRef.current = latest;

    setState((prev) => {
      const scrolled = latest > SCROLLED_AFTER_PX;
      let hidden = prev.hidden;
      if (latest <= HIDE_AFTER_PX) hidden = false;
      else if (movedEnough) hidden = delta > 0;

      return scrolled === prev.scrolled && hidden === prev.hidden ? prev : { scrolled, hidden };
    });
  });

  return state;
}