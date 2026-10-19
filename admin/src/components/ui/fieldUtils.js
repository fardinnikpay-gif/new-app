import { cx } from "../../utils/cx";

export const fieldClass = (hasError) =>
  cx(
    "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500",
    hasError ? "border-danger" : "border-gray-300"
  );

export const getDescribedBy = (id, error, hint) => {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
};