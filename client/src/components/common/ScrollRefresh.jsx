import { useEffect } from "react";

const DEBOUNCE_MS = 250;
const HEIGHT_TOLERANCE_PX = 2;

// Renders nothing. Refreshes ScrollTrigger when the page height changes (data/images loaded),
// when the window finishes loading and when fonts are ready. GSAP is imported lazily.
export default function ScrollRefresh() {
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const root = document.documentElement;
      let lastHeight = root.scrollHeight;
      let timer;

      // GSAP's own refresh changes the height temporarily: remember the height after each
      // refresh so it can never trigger another one (no loop).
      const syncHeight = () => {
        lastHeight = root.scrollHeight;
      };
      ScrollTrigger.addEventListener("refresh", syncHeight);

      const schedule = () => {
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), DEBOUNCE_MS);
      };

      const observer = new ResizeObserver(() => {
        if (Math.abs(root.scrollHeight - lastHeight) > HEIGHT_TOLERANCE_PX) schedule();
      });
      observer.observe(document.body);

      window.addEventListener("load", schedule);
      document.fonts?.ready.then(() => {
        if (!disposed) schedule();
      });

      cleanup = () => {
        clearTimeout(timer);
        observer.disconnect();
        window.removeEventListener("load", schedule);
        ScrollTrigger.removeEventListener("refresh", syncHeight);
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return null;
}