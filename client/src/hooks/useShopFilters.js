import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_SORT, FILTER_KEYS, SORT_OPTIONS } from "../data/shopFilters";

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);

const toPrice = (value) => {
  if (!value) return "";
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? String(number) : "";
};

const isEmpty = (value) => value === null || value === undefined || value === "" || value === false;

// All shop filters live in the URL query. patch values: "" / null / false remove the param.
export default function useShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const filters = useMemo(() => {
    const params = new URLSearchParams(queryString);
    const sort = params.get("sort");
    const page = parseInt(params.get("page"), 10);

    return {
      category: (params.get("category") || "").toLowerCase(),
      brand: params.get("brand") || "",
      size: params.get("size") || "",
      color: (params.get("color") || "").toLowerCase(),
      minPrice: toPrice(params.get("minPrice")),
      maxPrice: toPrice(params.get("maxPrice")),
      search: params.get("search") || "",
      onSale: params.get("onSale") === "true",
      sort: SORT_VALUES.includes(sort) ? sort : DEFAULT_SORT,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    };
  }, [queryString]);

  const setFilters = useCallback(
    (patch, { replace = false } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            const isDefault =
              (key === "sort" && value === DEFAULT_SORT) || (key === "page" && Number(value) === 1);
            if (isEmpty(value) || isDefault) next.delete(key);
            else next.set(key, String(value));
          });
          if (!("page" in patch)) next.delete("page"); // any filter change goes back to page 1
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const setFilter = useCallback(
    (key, value, options) => setFilters({ [key]: value }, options),
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      [...FILTER_KEYS, "page"].forEach((key) => next.delete(key));
      return next;
    });
  }, [setSearchParams]);

  const activeCount = useMemo(() => {
    let count = ["category", "brand", "size", "color", "search"].filter((key) => filters[key]).length;
    if (filters.minPrice || filters.maxPrice) count += 1;
    if (filters.onSale) count += 1;
    return count;
  }, [filters]);

  return { filters, setFilter, setFilters, clearFilters, activeCount };
}