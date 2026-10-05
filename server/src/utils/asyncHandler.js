/** Wraps an async route handler so rejected promises go to next(err). */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};