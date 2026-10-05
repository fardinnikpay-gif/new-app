/**
 * Operational (expected) error with an HTTP status code.
 * The central errorHandler (step 4) turns it into { success: false, message }.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}