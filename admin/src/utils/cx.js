// Joins truthy class names (supports nested arrays).
export const cx = (...classes) => classes.flat(Infinity).filter(Boolean).join(" ");