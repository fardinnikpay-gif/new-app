/**
 * Lowercase, hyphen-separated slug. Keeps unicode letters/digits (so Persian
 * titles work), strips Latin diacritics and special characters.
 * May return an empty string if the text has no letters or digits.
 */
export const makeSlug = (text) =>
  String(text ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Latin diacritics only
    .normalize("NFC") // recompose Persian letters such as "آ"
    .toLowerCase()
    .replace(/['’`]/g, "") // men's -> mens
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");