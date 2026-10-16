import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// After a route change, move focus to <main> so screen-reader and keyboard users
// start at the new page instead of in the old header.
export default function RouteFocus() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}