import { cx } from "./utils/cx";
import { formatPrice, formatDate } from "./utils/format";
import { getColorHex } from "./utils/colors";
import { safeGet, safeSet } from "./utils/storage";

const SWATCHES = ["bg-primary", "bg-primary-light", "bg-accent", "bg-ink"];

export default function App() {
  safeSet("step2-test", { ok: true });
  const stored = safeGet("step2-test", null);

  return (
    <main className="mx-auto grid min-h-screen max-w-xl place-content-center gap-8 px-6">
      <h1 className="text-4xl">{import.meta.env.VITE_SITE_NAME}</h1>

      <div className="flex gap-3">
        {SWATCHES.map((swatch) => (
          <span key={swatch} className={cx("h-12 w-12 rounded-lg shadow-soft", swatch)} />
        ))}
      </div>

      <ul className="space-y-1 rounded-lg border border-line p-4 text-sm shadow-soft">
        <li>formatPrice(1234.5) = {formatPrice(1234.5)}</li>
        <li>formatPrice("abc") = "{formatPrice("abc")}"</li>
        <li>formatDate = {formatDate("2026-10-10T08:00:00Z")}</li>
        <li>getColorHex("Navy") = {getColorHex("Navy")}</li>
        <li>getColorHex("nope") = {String(getColorHex("nope"))}</li>
        <li>storage roundtrip = {JSON.stringify(stored)}</li>
      </ul>

      <button type="button" className="rounded-lg bg-primary px-5 py-3 text-white">
        Press Tab to see the focus ring
      </button>
      <p>Select this text to see the selection color.</p>
    </main>
  );
}