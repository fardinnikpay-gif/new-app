const CURRENCY = import.meta.env.VITE_CURRENCY || "USD";

const createPriceFormatter = () => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY });
  } catch {
    // Invalid VITE_CURRENCY (must be an ISO 4217 code) -> safe fallback.
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  }
};

const priceFormatter = createPriceFormatter();
const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const toDate = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "-";
  const value = Number(amount);
  return Number.isFinite(value) ? priceFormatter.format(value) : "-";
};

export const formatDate = (iso) => {
  const date = toDate(iso);
  return date ? dateFormatter.format(date) : "-";
};

export const formatDateTime = (iso) => {
  const date = toDate(iso);
  return date ? dateTimeFormatter.format(date) : "-";
};