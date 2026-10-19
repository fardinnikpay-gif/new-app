// Product color name -> hex, used only for the small color dot preview.
const COLOR_HEX = {
  black: "#111111",
  white: "#ffffff",
  gray: "#9ca3af",
  grey: "#9ca3af",
  silver: "#d1d5db",
  red: "#dc2626",
  maroon: "#7f1d1d",
  burgundy: "#7f1d1d",
  pink: "#ec4899",
  orange: "#f97316",
  yellow: "#facc15",
  gold: "#d4a017",
  beige: "#e8dcc2",
  cream: "#fffdd0",
  brown: "#78350f",
  khaki: "#bdb76b",
  green: "#16a34a",
  olive: "#6b7d2c",
  teal: "#0d9488",
  turquoise: "#2dd4bf",
  blue: "#2563eb",
  navy: "#1e3a8a",
  sky: "#38bdf8",
  purple: "#9333ea",
  lavender: "#c4b5fd",
};

export const getColorHex = (name) =>
  COLOR_HEX[String(name ?? "").trim().toLowerCase()] ?? null;