import bcrypt from "bcryptjs";
import User, { RESET_TOKEN_TTL_MS } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/token.js";
import { sendTemplateEmail } from "./emailService.js";
import { welcomeEmail, resetPasswordEmail } from "../utils/emailTemplates.js";
import { config } from "../config/env.js";

const INVALID_CREDENTIALS = "Invalid credentials";

// Hash of a random secret nobody knows. It is compared when the user does not exist,
// so "unknown user" and "wrong password" take the same time (no enumeration by timing).
const DUMMY_HASH = "$2b$12$XuXxxIAV8PLT8ALzde6tG.apObz2qEj4OHJo5cbofdJbcPWiHERZy";

/** Duplicate email/phone surfaces as Mongo error 11000, which errorHandler turns into 409. */
export const registerUser = async ({ name, email, phone, password }) => {
  if (!email && !phone) throw new ApiError(400, "Either email or phone is required");

  // Explicit fields only: role (or anything else) can never come from the request
  const user = await User.create({ name, email, phone, password });

  // Not awaited on purpose: a slow or broken mail server must never delay or break registration
  if (user.email) void sendTemplateEmail(user.email, () => welcomeEmail(user));

  return user.toJSON();
};

/** Same 401 message for an unknown identifier and a wrong password. */
export const loginUser = async ({ identifier, password }) => {
  const filter = identifier.includes("@") ? { email: identifier } : { phone: identifier };
  const user = await User.findOne(filter).select("+password");

  let passwordMatches = false;
  if (user) passwordMatches = await user.comparePassword(password);
  else await bcrypt.compare(password, DUMMY_HASH);

  if (!user || !passwordMatches) throw new ApiError(401, INVALID_CREDENTIALS);

  return { user: user.toJSON(), token: signToken(user.id) };
};

// A second request inside this window is ignored (no new token, no new email),
// so nobody can flood an inbox or keep replacing a token the user is about to use.
const RESET_COOLDOWN_MS = 60 * 1000;

/**
 * Always resolves the same way, whether or not the email belongs to an account
 * (the controller answers with one fixed message).
 */
export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email }).select("+resetPasswordExpire");
  if (!user) return;

  const issuedAt = user.resetPasswordExpire ? user.resetPasswordExpire.getTime() - RESET_TOKEN_TTL_MS : 0;
  if (Date.now() - issuedAt < RESET_COOLDOWN_MS) return;

  const rawToken = user.createPasswordResetToken(); // only the SHA-256 hash is stored
  await user.save();

  // Adjust the path if your client uses a different reset page route
  const url = `${config.clientUrl}/reset-password/${rawToken}`;
  void sendTemplateEmail(user.email, () => resetPasswordEmail(url)); // not awaited: same response time either way
};

/** Consumes the token atomically, so it works exactly once even for parallel requests. */
export const resetPasswordWithToken = async (rawToken, newPassword) => {
  const user = await User.findOneAndUpdate(
    { resetPasswordToken: User.hashResetToken(rawToken), resetPasswordExpire: { $gt: new Date() } },
    { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } }
  );
  if (!user) throw new ApiError(400, "Invalid or expired reset token");

  user.password = newPassword; // saving hashes it and sets passwordChangedAt (old sessions end)
  await user.save();

  return { user: user.toJSON(), token: signToken(user.id) };
};