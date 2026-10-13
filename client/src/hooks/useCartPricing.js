import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { previewCart } from "../api/cartApi";
import { extractIssues, toPreviewItems } from "../utils/cart";
import useDebounce from "./useDebounce";

const DEBOUNCE_MS = 400;

// Fetches real prices from POST /cart/preview (debounced, previous request cancelled).
export default function useCartPricing(items, couponCode) {
  const requestKey = useMemo(
    () => JSON.stringify({ items: toPreviewItems(items), couponCode: couponCode || undefined }),
    [items, couponCode]
  );
  const debouncedKey = useDebounce(requestKey, DEBOUNCE_MS);

  const [state, setState] = useState({ pricing: null, loading: items.length > 0, error: null });
  const [reloadToken, setReloadToken] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const body = JSON.parse(debouncedKey);
    if (!body.items.length) {
      setState({ pricing: null, loading: false, error: null });
      return undefined;
    }

    const controller = new AbortController();
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    (async () => {
      try {
        const pricing = await previewCart(body, { signal: controller.signal });
        if (id === requestId.current) setState({ pricing, loading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted || id !== requestId.current) return;
        setState((prev) => ({ ...prev, loading: false, error }));
      }
    })();

    return () => controller.abort();
  }, [debouncedKey, reloadToken]);

  const issues = useMemo(() => extractIssues(items, state.pricing), [items, state.pricing]);
  const reload = useCallback(() => setReloadToken((value) => value + 1), []);

  // while the debounce is pending the shown prices are stale, so report loading
  const loading = state.loading || (items.length > 0 && debouncedKey !== requestKey);

  return { pricing: state.pricing, loading, error: state.error, issues, reload };
}