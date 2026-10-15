import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

// Gentle scroll-linked drift for an element that starts near the top of the page.
// Desktop only; phones and reduced-motion get nothing. Attach it to a plain wrapper,
// never to an element that Framer Motion also animates.
export default function useScrollShift(ref, { y = 0, opacity = 1, end = "bottom top" } = {}) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      gsap.to(element, {
        y,
        opacity,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, [ref, y, opacity, end]);
}