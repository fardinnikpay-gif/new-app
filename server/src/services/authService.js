import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/token.js";

import { sendTemplateEmail } from "./emailService.js";
import { welcomeEmail } from "../utils/emailTemplates.js";

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

  r
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