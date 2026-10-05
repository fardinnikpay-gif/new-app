const SOURCES = ["body", "query", "params"];

// Express 5 makes req.query a read-only getter, so define an own property instead
// (works on Express 4 and 5). Downstream code then only ever sees validated data.
const setRequestPart = (req, source, value) => {
  Object.defineProperty(req, source, { value, writable: true, configurable: true, enumerable: true });
};

/**
 * validate(schema)           -> validates req.body
 * validate(schema, "query")  -> validates req.query
 * validate(schema, "params") -> validates req.params
 * On success the parsed result (unknown keys stripped, transforms applied) replaces the original.
 * On failure the ZodError goes to errorHandler (400 with a field error list).
 */
export const validate = (schema, source = "body") => {
  if (!SOURCES.includes(source)) {
    throw new Error(`validate(): source must be one of ${SOURCES.join(", ")}`);
  }

  return (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) return next(result.error);

    setRequestPart(req, source, result.data);
    next();
  };
};