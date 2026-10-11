import { useCallback, useSyncExternalStore } from "react";

// useMediaQuery(query) | in: CSS media query string | out: boolean, updates when the query result changes
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}