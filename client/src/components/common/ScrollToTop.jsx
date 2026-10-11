import { useEffect } from "react";

// PageTransition resets the scroll after the old page has faded out. The browser must therefore not restore
// scroll positions itself, otherwise Back/Forward would jump while the old page is still visible.
export default function ScrollToTop() {
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return null;
}