import { Fragment } from "react";

// The exact shape of shippingAddress is not in the API table, so every filled text/number
// field is shown with a readable label instead of guessing field names.
const HIDDEN_KEYS = ["_id", "id", "__v"];

const humanize = (key) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

const toEntries = (address) =>
  Object.entries(address).filter(
    ([key, value]) =>
      !HIDDEN_KEYS.includes(key) &&
      (typeof value === "string" || typeof value === "number") &&
      String(value).trim() !== ""
  );

export default function ShippingAddress({ address, emptyText = "No shipping address." }) {
  if (typeof address === "string" && address.trim()) {
    return <p className="text-sm text-ink">{address}</p>;
  }

  const entries = address && typeof address === "object" ? toEntries(address) : [];
   if (entries.length === 0) {
    return <p className="text-sm text-gray-500">{emptyText}</p>;
  }

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      {entries.map(([key, value]) => (
        <Fragment key={key}>
          <dt className="text-gray-500">{humanize(key)}</dt>
          <dd className="text-ink">{String(value)}</dd>
        </Fragment>
      ))}
    </dl>
  );
}