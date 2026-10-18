
import { useEffect, useState } from "react";

// Shows the mobile bar only while the main CTA is out of view and the end of the
// product content hasn't been reached (so the bar never covers the footer).
export default function useStickyBar(ctaRef, endRef, enabled) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    const cta = ctaRef.current;
    const end = endRef.current;

    if (!cta || !end) return undefined;

    let ctaVisible = true;
    let endReached = false;

    const update = () => {
      setShow(!ctaVisible && !endReached);
    };

    const ctaObserver = new IntersectionObserver(([entry]) => {
      ctaVisible = entry.isIntersecting;
      update();
    });

    const endObserver = new IntersectionObserver(([entry]) => {
      endReached =
        entry.isIntersecting || entry.boundingClientRect.top < 0;
      update();
    });

    ctaObserver.observe(cta);
    endObserver.observe(end);

    return () => {
      ctaObserver.disconnect();
      endObserver.disconnect();
    };
  }, [ctaRef, endRef, enabled]);

  return enabled && show;
}
