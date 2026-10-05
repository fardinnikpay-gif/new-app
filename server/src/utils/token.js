import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const AUTH_COOKIE_NAME = "token";
export const JWT_ALGORITHM = "HS256";

/** Signs a token whose payload is only the user id (role is re-read from the DB on each request). */
export const signToken = (userId) =>
  jwt.sign({ id: String(userId) }, config.jwt.secret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: config.jwt.expiresIn,
  });

/** Returns the payload ({ id, iat, exp }) or throws a jsonwebtoken error. */
export const verifyToken = (token) =>
  jwt.verify(token, config.jwt.secret, { algorithms: [JWT_ALGORITHM] });

// client and admin are separate origins in production, so the cookie must be
// SameSite=None (which requires Secure). In development lax over http works.
const cookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? "none" : "lax",
  path: "/",
});

/** The cookie expires exactly when the JWT does, whatever JWT_EXPIRES is. */
export const setAuthCookie = (res, token) => {
  const { exp } = jwt.decode(token);
  res.cookie(AUTH_COOKIE_NAME, token, { ...cookieOptions(), expires: new Date(exp * 1000) });
};

/** Must use the same attributes as setAuthCookie or the browser may keep the cookie. */
export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions());
};