import { useEffect, useState } from "react";

// useDebounce(value, delay) | out: value, updated only after it stayed unchanged for `delay` ms
export default function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}