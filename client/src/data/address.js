const FIELDS = ["fullName", "phone", "city", "street", "postalCode"];

// The shipping address sent to POST /orders (no _id / isDefault).
export const toShippingAddress = (address) =>
  address ? Object.fromEntries(FIELDS.map((key) => [key, address[key] ?? ""])) : null;

export const sameAddress = (a, b) =>
  FIELDS.every((key) => String(a[key] ?? "").trim() === String(b[key] ?? "").trim());