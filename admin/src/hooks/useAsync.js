import { useCallback, useEffect, useRef, useState } from "react";

// fn receives an AbortSignal: useAsync((signal) => getAdminOrders(params, signal), [params])
// Re-runs when deps change or reload() is called; the previous request is aborted.
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fnRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({ ...prev, loading: false, error }));
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { ...state, reload };
}