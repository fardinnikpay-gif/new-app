import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "../../animations/gsap";
import useMediaQuery from "../../hooks/useMediaQuery";
import { QUERIES } from "../../utils/media";
import { registerLenis } from "../../utils/scrollLock";

const LenisContext = createContext(null);

const LENIS_LERP = 0.1;
const MS_PER_SECOND = 1000;
const GSAP_LAG_THRESHOLD_MS = 500; // gsap defaults, restored on cleanup
const GSAP_LAG_ADJUST_MS = 33;

// useLenis() | out: the Lenis instance, or null (phone, reduced-motion, before mount)
export function useLenis() {
  return useContext(LenisContext);
}

// Lenis runs on tablet and desktop only; phones and reduced-motion users keep native scrolling.
export default function SmoothScroll({ children }) {
  const reduceMotion = useMediaQuery(QUERIES.reducedMotion);
  const isTabletUp = useMediaQuery(QUERIES.tablet);
  const enabled = isTabletUp && !reduceMotion;
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const instance = new Lenis({ lerp: LENIS_LERP });
    const raf = (time) => instance.raf(time * MS_PER_SECOND);

    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    registerLenis(instance); // lets Modal and Drawer stop/start Lenis while they lock the page
    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(GSAP_LAG_THRESHOLD_MS, GSAP_LAG_ADJUST_MS);
      registerLenis(null);
      instance.destroy();
      setLenis(null);
    };
  }, [enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}