// cx(...classes) | in: string | number | array | object | falsy values | out: string
export function cx(...args) {
  const out = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string" || typeof arg === "number") {
      out.push(String(arg));
    } else if (Array.isArray(arg)) {
      const inner = cx(...arg);
      if (inner) out.push(inner);
    } else if (typeof arg === "object") {
      for (const [key, value] of Object.entries(arg)) {
        if (value) out.push(key);
      }
    }
  }

  return out.join(" ");
}