export const DEFAULT_PAYMENT_METHOD = "cod";
export const MAX_SAVED_ADDRESSES = 5;
export const NEW_ADDRESS_ID = "new";

// Step 18 turns on the card method (enabled: true).
export const paymentMethods = [
  {
    value: "cod",
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives.",
    enabled: true,
  },
  {
    value: "stripe",
    label: "Credit or debit card",
    description: "Secure online payment.",
    enabled: false,
  },
];

export const isPaymentEnabled = (value) =>
  paymentMethods.some((method) => method.value === value && method.enabled);
export const isStripeConfigured = Boolean(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim()
);
