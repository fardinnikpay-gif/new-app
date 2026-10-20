import { useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const FIRST_PAGE = 1;

const toPage = (raw) => {
  const page = Number.parseInt(raw, 10);
  return Number.isInteger(page) && page > 0 ? page : FIRST_PAGE;
};

const isEmpty = (value) => value === "" || value === null || value === undefined;

// usePagedQuery({ search: "", status: "" })
// params is memoized: it only changes when the URL query changes, and it
// contains only non-empty values (safe to pass straight to the API).
export default function usePagedQuery(initial = {}) {
  const initialRef = useRef(initial);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();

  const params = useMemo(() => {
    const current = new URLSearchParams(query);
    const result = { page: toPage(current.get("page")) };

    for (const [key, fallback] of Object.entries(initialRef.current)) {
      if (key === "page") continue;
      const value = current.get(key) ?? fallback;
      if (!isEmpty(value)) result[key] = value;
    }
    return result;
  }, [query]);

  const update = useCallback(
    (changes, { replace, resetPage }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            const isFirstPage = key === "page" && Number(value) === FIRST_PAGE;
            if (isEmpty(value) || isFirstPage) next.delete(key);
            else next.set(key, String(value));
          }
          if (resetPage) next.delete("page");
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const setPage = useCallback((page) => update({ page }, { replace: false }), [update]);
  const setSearch = useCallback(
    (value) => update({ search: value }, { replace: true, resetPage: true }),
    [update]
  );
  const setFilter = useCallback(
    (key, value) => update({ [key]: value }, { replace: false, resetPage: true }),
    [update]
  );

  return { params, setPage, setSearch, setFilter };
}