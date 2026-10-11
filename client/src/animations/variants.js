// Central motion settings. Only opacity and transform are ever animated.
export const DURATION = { fast: 0.25, base: 0.6, slow: 0.9 };
export const EASE = { out: [0.22, 1, 0.36, 1], inOut: [0.76, 0, 0.24, 1] };
export const OFFSET = { y: 32, x: 48 };
export const SCALE_FROM = 0.96;
export const STAGGER = 0.08;
export const TEXT_STAGGER = 0.04;
export const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" };

const enter = (delay = 0) => ({ duration: DURATION.base, ease: EASE.out, delay });

// All variants use the labels "hidden" and "visible". `custom` can carry { delay, y, x }.
export const fade = {
  hidden: { opacity: 0 },
  visible: ({ delay } = {}) => ({ opacity: 1, transition: enter(delay) }),
};

export const fadeUp = {
  hidden: ({ y = OFFSET.y } = {}) => ({ opacity: 0, y }),
  visible: ({ delay } = {}) => ({ opacity: 1, y: 0, transition: enter(delay) }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: SCALE_FROM },
  visible: ({ delay } = {}) => ({ opacity: 1, scale: 1, transition: enter(delay) }),
};

// slideIn: custom={{ x: -OFFSET.x }} slides in from the left
export const slideIn = {
  hidden: ({ x = OFFSET.x } = {}) => ({ opacity: 0, x }),
  visible: ({ delay } = {}) => ({ opacity: 1, x: 0, transition: enter(delay) }),
};

// makeStagger(step, delay) | container variant: children using the same labels start one after another
export const makeStagger = (step = STAGGER, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const stagger = makeStagger();

// A word rising out of its mask (used by TextReveal)
export const wordReveal = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: DURATION.slow, ease: EASE.out } },
};