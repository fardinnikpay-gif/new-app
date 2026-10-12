import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CLIP_HIDDEN = "inset(100% 0% 0% 0%)";
const CLIP_VISIBLE = "inset(0% 0% 0% 0%)";
const REVEAL_DURATION_S = 1.1;
const IMAGE_START_SCALE = 1.25;
const SCRUB_SMOOTHING_S = 1;

// mode: "horizontal" (pinned horizontal scroll, desktop) | "vertical" | "static" (reduced motion).
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
      let scrollTween;

      if (mode === "horizontal") {
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        scrollTween = gsap.to(track, {
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
          },
        });
      }

      gsap.utils.toArray("[data-cat-card]", section).forEach((card) => {
        const frame = card.querySelector("[data-cat-image]");
        const image = card.querySelector("[data-cat-img]");

        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: mode === "horizontal" ? "left 85%" : "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          })
          .fromTo(
            frame,
            { clipPath: CLIP_HIDDEN },
            { clipPath: CLIP_VISIBLE, duration: REVEAL_DURATION_S, ease: "power3.out" },
            0
          )
          .fromTo(
            image,
            { scale: IMAGE_START_SCALE },
            { scale: 1, duration: REVEAL_DURATION_S, ease: "power3.out" },
            0
          );
      });
    }, section);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [enabled, mode, dataKey, sectionRef, trackRef]);
}