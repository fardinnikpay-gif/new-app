import { useLayoutEffect, useRef } from "react";
import { gsap } from "../animations/gsap";
import { QUERIES } from "../utils/media";
import useMediaQuery from "./useMediaQuery";

// useGsapContext(callback, deps) | out: scopeRef , attach it to the root element of your animation
// callback(self, mm) runs inside gsap.context (selectors are scoped to scopeRef); mm is a gsap.matchMedia()
// instance for desktop-only effects: mm.add("(min-width: 1024px)", () => {...}, scopeRef.current)
// Everything (tweens, ScrollTriggers, matchMedia) is reverted on cleanup.
// With prefers-reduced-motion the callback is NOT run, so GSAP never hides content.
export default function useGsapContext(callback, deps = []) {
  const scopeRef = useRef(null);
  const callbackRef = useRef(callback);
  const reduceMotion = useMediaQuery(QUERIES.reducedMotion);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;

    const mm = gsap.matchMedia();
    const ctx = gsap.context((self) => callbackRef.current(self, mm), scopeRef.current ?? undefined);

    return () => {
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, ...deps]);

  return scopeRef;
}