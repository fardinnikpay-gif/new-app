import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const TABLET_MOTION =
  "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)";

const END_SCALE = 0.92;
const END_OPACITY = 0.4;
const PARALLAX_SHIFT = 6; // yPercent, must stay within the extra area created by PARALLAX_SCALE
const PARALLAX_SCALE = 1.15;

// Scroll effects for the hero: pin + scale/fade (desktop), scale/fade (tablet), parallax on images.
// Phones and reduced-motion get no ScrollTrigger at all.
export default function useHeroScroll({ sectionRef, innerRef }, resetKey) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return undefined;

    const mm = gsap.matchMedia(section);

    mm.add({ isDesktop: DESKTOP_MOTION, isTablet: TABLET_MOTION }, (context) => {
      const { isDesktop } = context.conditions;
      const parallaxTargets = [...section.querySelectorAll("[data-hero-parallax]")];

      // will-change only while the trigger is active, so no layers are kept around needlessly
      const hinted = [inner, ...parallaxTargets];
      const setHint = (value) => hinted.forEach((el) => (el.style.willChange = value));

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: isDesktop,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => setHint(self.isActive ? "transform, opacity" : "auto"),
          },
        })
        .to(inner, { scale: END_SCALE, opacity: END_OPACITY }, 0)
        .fromTo(
          parallaxTargets,
          { yPercent: -PARALLAX_SHIFT, scale: PARALLAX_SCALE },
          { yPercent: PARALLAX_SHIFT, scale: PARALLAX_SCALE },
          0
        );

      return () => setHint("");
    });

    return () => mm.revert(); // kills ScrollTriggers and restores inline styles
  }, [sectionRef, innerRef, resetKey]);
}