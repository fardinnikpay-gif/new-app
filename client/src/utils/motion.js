// Single scale for durations/eases/staggers. Import from here instead of hard-coding numbers.
export const DURATION = { fast: 0.2, base: 0.3, slow: 0.6, cinematic: 1.1 };

export const EASE = { out: [0.22, 1, 0.36, 1] };
export const GSAP_EASE = { out: "power3.out" };

export const STAGGER = { item: 0.06, maxItems: 8 };

// Framer Motion transitions
export const transitions = {
  fast: { duration: DURATION.fast, ease: EASE.out },
  base: { duration: DURATION.base, ease: EASE.out },
  slow: { duration: DURATION.slow, ease: EASE.out },
};

// Delay for item `index` of a list (capped, so long lists don't wait forever).
export const staggerDelay = (index) => Math.min(index, STAGGER.maxItems) * STAGGER.item;