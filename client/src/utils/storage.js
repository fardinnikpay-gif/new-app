// safeGet(key, fallback) | out: parsed value or fallback | errors: blocked storage / bad JSON -> fallback
export function safeGet(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// safeSet(key, value) | out: true on success, false on failure (private mode, quota)
export function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}