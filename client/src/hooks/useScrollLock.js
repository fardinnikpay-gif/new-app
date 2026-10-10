import { useEffect } from "react";
import { lockScroll, unlockScroll } from "../utils/scrollLock";

// useScrollLock(active) | in: boolean | locks page scroll while active is true
export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    lockScroll();
    return unlockScroll;
  }, [active]);
}