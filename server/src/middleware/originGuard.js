import { ApiError } from "../utils/ApiError.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const toOrigin = (value) => {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
};

// CLIENT_URL / ADMIN_URL may hold several comma-separated URLs
const getAllowedOrigins = () =>
  [process.env.CLIENT_URL, process.env.ADMIN_URL]
    .flatMap((value) => (value ? value.split(",") : []))
    .map(toOrigin)
    .filter(Boolean);

const isSameHost = (origin, host) => {
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

// CSRF defence for cookie auth: browsers always send Origin on cross-site writes.
// No Origin (curl, Stripe webhook, server-to-server) is allowed because it cannot be a cross-site browser request.
export const originGuard = (req, res, next) => {
  const origin = req.get("origin");
  if (SAFE_METHODS.has(req.method) || !origin) return next();

  const trusted = getAllowedOrigins().includes(origin) || isSameHost(origin, req.get("host"));
  if (!trusted) return next(new ApiError(403, "Request origin is not allowed"));
  next();
};