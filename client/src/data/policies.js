import { contactInfo } from "./contact";

// Set to false once the texts below have been reviewed by a legal professional.
export const SHOW_LEGAL_NOTICE = true;

export const terms = {
  title: "Terms of Service",
  updated: "2026-10-14",
  intro:
    "These sample terms describe how our online store works. By using the site or placing an order you agree to them.",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of terms",
      paragraphs: [
        "By accessing this website or placing an order, you confirm that you have read and agree to these terms.",
      ],
    },
    {
      id: "orders",
      title: "Orders and pricing",
      paragraphs: [
        "All orders are subject to availability and acceptance. Prices are shown at checkout and may change without notice, but the price confirmed in your order will not change.",
        "We may cancel an order if an item is out of stock or an error in the price or description is found.",
      ],
    },
    {
      id: "payment",
      title: "Payment",
      paragraphs: [
        "You can pay by card or in cash on delivery. Card payments are processed by a third-party payment provider.",
      ],
    },
    {
      id: "shipping",
      title: "Shipping and delivery",
      paragraphs: [
        "Orders are dispatched within the time shown at checkout. Delivery times are estimates and are not guaranteed.",
      ],
    },
    {
      id: "returns",
      title: "Returns and refunds",
      paragraphs: [
        "Unworn items in their original condition can be returned within 30 days of delivery. Refunds are issued to the original payment method once the return is checked.",
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      paragraphs: [
        "You are responsible for keeping your login details secure and for all activity under your account.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      paragraphs: [
        "All content on this site, including text, images and logos, belongs to us or our licensors and may not be used without permission.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      paragraphs: [
        "To the extent permitted by law, we are not liable for indirect or consequential losses arising from your use of the site or products.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: ["We may update these terms from time to time. The date above shows the latest version."],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [`Questions about these terms? Email us at ${contactInfo.email}.`],
    },
  ],
};

export const privacy = {
  title: "Privacy Policy",
  updated: "2026-10-14",
  intro:
    "This sample policy explains what personal information we collect, how we use it and the choices you have.",
  sections: [
    {
      id: "information",
      title: "Information we collect",
      paragraphs: [
        "We collect the details you give us, such as your name, email, phone number, delivery addresses and order history, and basic technical data when you use the site.",
      ],
    },
    {
      id: "usage",
      title: "How we use your information",
      paragraphs: [
        "We use your information to process and deliver orders, manage your account, provide support and improve our store.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      paragraphs: [
        "We use a secure cookie to keep you signed in, and your browser's local storage to remember your cart, coupon code and preferences.",
      ],
    },
    {
      id: "payments",
      title: "Payment data",
      paragraphs: [
        "Card payments are handled by our payment provider. We do not store your full card details on our servers.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing your information",
      paragraphs: [
        "We share information only with service providers that help us run the store (such as payment and delivery partners) or when the law requires it. We do not sell your personal data.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      paragraphs: [
        "We keep your information for as long as your account is active or as needed to meet legal and accounting obligations.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        "You can view and update your details in your account and ask us to correct or delete your data, subject to legal requirements.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We use reasonable technical and organisational measures to protect your information, but no online service can be completely secure.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: ["We may update this policy from time to time. The date above shows the latest version."],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [`For privacy questions, email us at ${contactInfo.email}.`],
    },
  ],
};