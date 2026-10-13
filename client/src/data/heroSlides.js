export const DEFAULT_PAYMENT_METHOD = "cod";
export const MAX_SAVED_ADDRESSES = 5;
export const NEW_ADDRESS_ID = "new";

// Card payments are available only when a Stripe publishable key is configured.
export const isStripeConfigured = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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
    enabled: isStripeConfigured,
  },
];

export const isPaymentEnabled = (value) =>
  paymentMethods.some((method) => method.value === value && method.enabled);

export const getPaymentLabel = (value) =>
  paymentMethods.find((method) => method.value === value)?.label ?? value;