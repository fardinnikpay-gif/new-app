// Backend stores only color names (e.g. "black"). Map name -> hex for swatches.
const COLOR_MAP = {
  black: "#000000",
  white: "#ffffff",
  gray: "#9ca3af",
  grey: "#9ca3af",
  red: "#dc2626",
  blue: "#2563eb",
  navy: "#1f2a44",
  green: "#16a34a",
  olive: "#6b7a2a",
  beige: "#d9c7a3",
  cream: "#f5efe0",
  brown: "#7a4b2a",
  pink: "#f4a6c0",
  yellow: "#facc15",
  orange: "#f97316",
  purple: "#7c3aed",
  khaki: "#b5a77a",
};

// getColorHex(name) | in: color name | out: hex string | errors: unknown name -> null (UI shows the name)
export function getColorHex(name) {
  if (typeof name !== "string") return null;
  return COLOR_MAP[name.trim().toLowerCase()] ?? null;
}