import { loadStripe } from "@stripe/stripe-js";
import { isStripeConfigured } from "../data/checkoutContent";

// Created once at module level (this file is only imported by the lazy Checkout chunk).
export const stripePromise = isStripeConfigured
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const COLOR_PATTERN = /^(#|rgb|hsl)/i;
// Used only if the theme tokens can't be read as hex/rgb/hsl.
const FALLBACK = { primary: "#2373F4", ink: "#000000", danger: "#DC2626" };
const FONT_STACK = "system-ui, -apple-system, 'Segoe UI', sans-serif";

const readColor = (cssVariable, fallback) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVariable).trim();
  return COLOR_PATTERN.test(value) ? value : fallback;
};

// Stripe Elements theme in sync with the brand tokens.
export const getStripeAppearance = () => ({
  theme: "stripe",
  variables: {
    colorPrimary: readColor("--color-primary", FALLBACK.primary),
    colorText: readColor("--color-ink", FALLBACK.ink),
    colorDanger: readColor("--color-red-600", FALLBACK.danger),
    fontFamily: FONT_STACK,
    borderRadius: "6px",
  },
});