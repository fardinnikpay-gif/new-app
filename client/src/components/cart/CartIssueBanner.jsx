import { AlertTriangle } from "lucide-react";

export default function CartIssueBanner({ count }) {
  if (!count) return null;
  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>
        {count === 1 ? "One item in your cart needs" : `${count} items in your cart need`} your
        attention. Update or remove {count === 1 ? "it" : "them"} to continue.
      </p>
    </div>
  );
}