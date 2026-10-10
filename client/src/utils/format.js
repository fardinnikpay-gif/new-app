const CURRENCY = import.meta.env.VITE_CURRENCY || "USD";

function createPriceFormatter(currency) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency });
  } catch {
    return null; // invalid currency code in .env
  }
}

const priceFormatter = createPriceFormatter(CURRENCY);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

// formatPrice(amount) | in: number | numeric string | out: string | errors: invalid number -> ""
export function formatPrice(amount) {
  const value = Number(amount);
  if (amount == null || !Number.isFinite(value)) return "";
  if (priceFormatter) return priceFormatter.format(value);
  return `${value.toFixed(2)} ${CURRENCY}`;
}

// formatDate(iso) | in: ISO date string | out: "Oct 10, 2026" | errors: invalid or empty -> ""
export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormatter.format(date);
}