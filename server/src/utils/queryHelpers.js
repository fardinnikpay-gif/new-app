// Query params can be arrays or objects (?page[]=1, ?search[$ne]=x), so only plain strings are accepted
export const asString = (value) => (typeof value === "string" ? value.trim() : undefined);

// Makes user input safe to put inside a RegExp (no injection, no ReDoS patterns)
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");