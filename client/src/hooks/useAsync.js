import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_STATE = { key: null, data: null, error: null };

// useAsync(fn, deps) | in: fn({ signal }) => Promise<data>, deps: JSON-serializable array
// out: { data, loading, error, reload } | errors: error is the { message, status } object from api/axios
// Canceled and stale requests are ignored, so a slow old response can never overwrite a newer one.
export default function useAsync(fn, deps = []) {
  const fnRef = useRef(fn);
  const [state, setState] = useState(INITIAL_STATE);
  const [reloadCount, setReloadCount] = useState(0);

  // deps are compared by value, so inline objects like { page, sort } do not cause refetch loops
  const requestKey = `${JSON.stringify(deps)}#${reloadCount}`;

  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => fnRef.current({ signal: controller.signal });

    run()
      .then((data) => {
        if (!controller.signal.aborted) setState({ key: requestKey, data, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.canceled) return;
        setState((prev) => ({ key: requestKey, data: prev.data, error }));
      });

    return () => controller.abort();
  }, [requestKey]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  // Loading means: the latest request key has no result yet. Previous data is kept while loading.
  const loading = state.key !== requestKey;

  return { data: state.data, loading, error: loading ? null : state.error, reload };
}