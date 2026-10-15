import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, GSAP_EASE } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

const CLIP_HIDDEN = "inset(100% 0% 0% 0%)";
const CLIP_VISIBLE = "inset(0% 0% 0% 0%)";
const IMAGE_START_SCALE = 1.25;
const SCRUB_SMOOTHING_S = 1;
const LIGHT_SHIFT_PX = 24;

// mode: "horizontal" (pinned horizontal scroll + clip-path reveal, desktop)
//       "vertical"   (phones/tablets: light fade-up only, no clip-path or image scaling)
//       "static"     (reduced motion: nothing)
// Clip-path reveal is the one deliberate exception to the transform/opacity-only rule.
export default function useCategoryShowcaseScroll(
  { sectionRef, trackRef, mode, enabled },
  dataKey
) {
  useLayoutEffect(() => {
    if (!enabled || mode === "static") return undefined;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || (mode === "horizontal" && !track)) return undefined;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray("[data-cat-card]", section);

      if (mode === "horizontal") {
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: SCRUB_SMOOTHING_S,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              track.style.willChange = self.isActive ? "transform" : "auto";
            },
          },
        });

        cards.forEach((card) => {
          const frame = card.querySelector("[data-cat-image]");
          const image = card.querySelector("[data-cat-img]");

          gsap
            .timeline({
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left 85%",
                toggleActions: "play none none none",
                once: true,
              },
            })
            .fromTo(
              frame,
              { clipPath: CLIP_HIDDEN },
              { clipPath: CLIP_VISIBLE, duration: DURATION.cinematic, ease: GSAP_EASE.out },
              0
            )
            .fromTo(
              image,
              { scale: IMAGE_START_SCALE },
              { scale: 1, duration: DURATION.cinematic, ease: GSAP_EASE.out },
              0
            );
        });
        return;
      }

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: LIGHT_SHIFT_PX },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.slow,
            ease: GSAP_EASE.out,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    }, section);

    ScrollTrigger.refresh();
    return () => {
      if (track) track.style.willChange = "";
      ctx.revert();
    };
  }, [enabled, mode, dataKey, sectionRef, trackRef]);
}