import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const AUTH_COOKIE_NAME = "token";
export const JWT_ALGORITHM = "HS256";

/** Returns the payload ({ id, iat, exp }) or throws a jsonwebtoken error. */
export const verifyToken = (token) =>
  jwt.verify(token, config.jwt.secret, { algorithms: [JWT_ALGORITHM] });