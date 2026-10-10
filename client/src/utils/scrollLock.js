// Ref-counted body scroll lock, coordinated with Lenis (registered by SmoothScroll in step 6).
let lenisInstance = null;
let lockCount = 0;
let previousStyles = { overflow: "", paddingRight: "" };

// registerLenis(instance | null) | called by SmoothScroll on create (instance) and cleanup (null)
export function registerLenis(instance) {
  lenisInstance = instance;
  if (instance && lockCount > 0) instance.stop();
}

// lockScroll() | in: nothing | safe to call from several overlays at once
export function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const { body, documentElement } = document;
  const gap = window.innerWidth - documentElement.clientWidth;

  previousStyles = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  body.style.overflow = "hidden";
  if (gap > 0) body.style.paddingRight = `${gap}px`;
  documentElement.style.setProperty("--scroll-lock-gap", `${gap}px`);

  lenisInstance?.stop();
}

// unlockScroll() | restores scrolling when the last lock is released
export function unlockScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  const { body, documentElement } = document;
  body.style.overflow = previousStyles.overflow;
  body.style.paddingRight = previousStyles.paddingRight;
  documentElement.style.removeProperty("--scroll-lock-gap");

  lenisInstance?.start();
}