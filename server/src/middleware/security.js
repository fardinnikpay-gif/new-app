import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { generalLimiter } from "./rateLimiters.js";

// Strips keys starting with "$" or containing "." (NoSQL operator injection).
// The stock mongoSanitize() middleware reassigns req.query, which crashes on
// Express 5 (read-only getter), so we call sanitize() and mutate in place.
// Express 5's default "simple" query parser cannot build nested operator
// objects anyway; on Express 4 this still cleans req.query.
const sanitizeRequest = (req, res, next) => {
  ["body", "query"].forEach((key) => {
    if (req[key] && typeof req[key] === "object") mongoSanitize.sanitize(req[key]);
  });
  next();
};

/** Must be called after express.json() and before the routes. */
export const applySecurity = (app) => {
  app.use(helmet());
  app.use(sanitizeRequest);
  app.use("/api", generalLimiter);
};