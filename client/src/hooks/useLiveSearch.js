import { getProducts } from "../api/productApi";
import useAsync from "./useAsync";
import useDebounce from "./useDebounce";

export const MIN_QUERY_LENGTH = 2;
export const RESULT_LIMIT = 6;
const DEBOUNCE_MS = 300;
const NO_RESULTS = [];

// useLiveSearch(query) | out: { results, total, loading, error, ready, canSearch, retry }
// canSearch: enough characters typed | loading: waiting for the debounce or for the response
// ready: results are final for the current text (tells "no results" apart from "still typing")
// The previous request is canceled by useAsync whenever the debounced text changes.
export default function useLiveSearch(query) {
  const trimmed = query.trim();
  const debounced = useDebounce(trimmed, DEBOUNCE_MS);
  const canSearch = trimmed.length >= MIN_QUERY_LENGTH;
  const requestable = debounced.length >= MIN_QUERY_LENGTH;

  const request = useAsync(
    ({ signal }) =>
      requestable ? getProducts({ search: debounced, limit: RESULT_LIMIT }, { signal }) : Promise.resolve(null),
    [debounced]
  );

  const waiting = canSearch && trimmed !== debounced;
  const loading = canSearch && (waiting || request.loading);
  const error = canSearch && !waiting ? request.error : null;
  const ready = canSearch && !loading && !error && Boolean(request.data);

  return {
    results: ready ? request.data.products : NO_RESULTS,
    total: ready ? request.data.total : 0,
    loading,
    error,
    ready,
    canSearch,
    retry: request.reload,
  };
}