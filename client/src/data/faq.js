// Sample answers: adjust them to match your real policies.
export const faqGroups = [
  {
    title: "Orders and delivery",
    items: [
      {
        id: "delivery-time",
        question: "How long does delivery take?",
        answer:
          "Orders are dispatched within 1–2 business days. Delivery options and costs are shown at checkout.",
      },
      {
        id: "track-order",
        question: "Can I track my order?",
        answer: "Yes. Sign in and open Orders in your account to see the status of every order.",
      },
      {
        id: "cancel-order",
        question: "Can I change or cancel my order?",
        answer:
          "You can cancel an order from your account while its status is Pending. Once it is being processed, please contact us.",
      },
    ],
  },
  {
    title: "Returns and refunds",
    items: [
      {
        id: "return-policy",
        question: "What is your return policy?",
        answer:
          "Unworn items in their original condition can be returned within 30 days of delivery for a refund or exchange.",
      },
      {
        id: "start-return",
        question: "How do I start a return?",
        answer: "Contact us with your order number and we'll send you the return instructions.",
      },
      {
        id: "refund-time",
        question: "When will I receive my refund?",
        answer:
          "Refunds are issued to your original payment method once we have received and checked the returned items.",
      },
    ],
  },
  {
    title: "Payment",
    items: [
      {
        id: "payment-methods",
        question: "Which payment methods do you accept?",
        answer: "You can pay by credit or debit card, or pay in cash on delivery.",
      },
      {
        id: "card-safety",
        question: "Is my card information safe?",
        answer:
          "Card payments are processed securely by Stripe. We never see or store your full card details.",
      },
      {
        id: "coupons",
        question: "How do coupon codes work?",
        answer:
          "Enter your code in the cart or at checkout. If it is valid, the discount is applied to your order total.",
      },
    ],
  },
  {
    title: "Sizing and account",
    items: [
      {
        id: "find-size",
        question: "How do I find my size?",
        answer:
          "Use our size guide, which lists measurements in both centimetres and inches for men, women and kids.",
      },
      {
        id: "reset-password",
        question: "How do I reset my password?",
        answer:
          "Choose “Forgot password?” on the login page and we'll email you a link to set a new one.",
      },
    ],
  },
];