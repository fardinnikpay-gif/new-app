import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "../../animations/gsap";
import useMediaQuery from "../../hooks/useMediaQuery";
import { QUERIES } from "../../utils/media";
import { registerLenis } from "../../utils/scrollLock";
import { LenisContext } from "./LenisContext";

const LENIS_LERP = 0.1;
const MS_PER_SECOND = 1000;
const GSAP_LAG_THRESHOLD_MS = 500;
const GSAP_LAG_ADJUST_MS = 33;



// Lenis runs on tablet and desktop only; phones and reduced-motion users keep native scrolling.
export default function SmoothScroll({ children }) {
  const reduceMotion = useMediaQuery(QUERIES.reducedMotion);
  const isTabletUp = useMediaQuery(QUERIES.tablet);
  const enabled = isTabletUp && !reduceMotion;
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const instance = new Lenis({ lerp: LENIS_LERP });
    lenisRef.current = instance;

    const raf = (time) => instance.raf(time * MS_PER_SECOND);

    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    registerLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(
        GSAP_LAG_THRESHOLD_MS,
        GSAP_LAG_ADJUST_MS
      );
      registerLenis(null);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return (
  <LenisContext.Provider value={lenisRef.current}>
    {children}
  </LenisContext.Provider>
);
}

export { useLenis } from "./LenisContext";
