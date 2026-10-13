const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{7,15}$/; // adjust here if your backend needs a stricter format
const PHONE_SEPARATORS = /[\s\-().]/g;

const tryParse = (value) => {
  const text = String(value ?? "").trim();
  if (EMAIL_PATTERN.test(text)) return { email: text.toLowerCase() };
  const phone = text.replace(PHONE_SEPARATORS, "");
  return PHONE_PATTERN.test(phone) ? { phone } : null;
};

export const isValidIdentifier = (value) => tryParse(value) !== null;

// Returns { email } or { phone }. Throws for anything that is neither.
export const parseIdentifier = (value) => {
  const result = tryParse(value);
  if (!result) throw new Error("Enter a valid email or phone number");
  return result;
};

export const normalizePhone = (value) => String(value ?? "").trim().replace(PHONE_SEPARATORS, "");
export const isValidPhone = (value) => PHONE_PATTERN.test(normalizePhone(value));