import { ApiError } from "./ApiError.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const MAX_PAGE = 10000;

const toPositiveInt = (value, name, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1) {
    throw new ApiError(400, `${name} must be a positive integer`);
  }
  return n;
};

/**
 * Reads page/limit from a query object.
 * Invalid values -> 400. limit above 50 is clamped to 50.
 */
export const getPagination = (query = {}) => {
  const page = toPositiveInt(query.page, "page", DEFAULT_PAGE);
  if (page > MAX_PAGE) throw new ApiError(400, `page must be at most ${MAX_PAGE}`);

  const limit = Math.min(toPositiveInt(query.limit, "limit", DEFAULT_LIMIT), MAX_LIMIT);
  return { page, limit, skip: (page - 1) * limit };
};