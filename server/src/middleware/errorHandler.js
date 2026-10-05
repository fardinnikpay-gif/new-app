import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/env.js";

const label = (field, message) => (field ? `${field}: ${message}` : message);

const fromZod = (err) => {
  const errors = err.issues.map((issue) => ({
    field: issue.path.map(String).join("."),
    message: issue.message,
  }));
  return { statusCode: 400, message: label(errors[0]?.field, errors[0]?.message ?? "Validation failed"), errors };
};

const fromMongooseValidation = (err) => {
  const errors = Object.values(err.errors ?? {}).map((e) => ({ field: e.path, message: e.message }));
  return { statusCode: 400, message: label(errors[0]?.field, errors[0]?.message ?? "Validation failed"), errors };
};

const fromDuplicateKey = (err) => {
  const fields = Object.keys(err.keyPattern ?? err.keyValue ?? {});
  return { statusCode: 409, message: fields.length ? `${fields.join(", ")} already exists` : "Duplicate value" };
};

/** Maps any thrown error to { statusCode, message, errors? }. */
const normalizeError = (err) => {
  if (err instanceof ApiError) return { statusCode: err.statusCode, message: err.message };

  switch (err?.name) {
    case "ZodError":
      return fromZod(err);
    case "ValidationError":
      return fromMongooseValidation(err);
    case "CastError":
      return { statusCode: 400, message: `Invalid ${err.path}` };
    case "JsonWebTokenError":
    case "NotBeforeError":
      return { statusCode: 401, message: "Invalid token" };
    case "TokenExpiredError":
      return { statusCode: 401, message: "Token expired" };
    default:
      break;
  }

  if (err?.code === 11000) return fromDuplicateKey(err);
  if (err?.type === "entity.parse.failed") return { statusCode: 400, message: "Invalid JSON body" };
  if (err?.type === "entity.too.large") return { statusCode: 413, message: "Request body too large" };

  const message = config.isProduction ? "Internal server error" : err?.message || "Internal server error";
  return { statusCode: 500, message };
};

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.path}`));
};

// Express recognizes error middleware by its 4 arguments: do not remove `next`
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const { statusCode, message, errors } = normalizeError(err);

  if (statusCode >= 500 && !config.isTest) console.error(err);

  const body = { success: false, message };
  if (errors) body.errors = errors;
  if (statusCode >= 500 && !config.isProduction) body.stack = err?.stack;

  res.status(statusCode).json(body);
};