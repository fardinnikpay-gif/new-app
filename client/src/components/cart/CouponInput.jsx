import { useState } from "react";
import { Tag, X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

// States: idle, loading (while onApply is pending), applied (applied code set), error (error text set).
// onApply(code) may return a Promise<boolean>; false keeps the typed code.
export default function CouponInput({ onApply, onRemove, applied, error }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = code.trim();
    if (!value || loading) return;
    setLoading(true);
    try {
      const ok = await onApply(value);
      if (ok !== false) setCode("");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-md bg-neutral-100 px-4 py-2 text-sm">
        <span className="flex items-center gap-2 text-ink">
          <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>
            <strong>{applied}</strong> applied
          </span>
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove coupon"
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-neutral-200"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Coupon code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoComplete="off"
          />
        </div>
        <Button type="submit" variant="outline" loading={loading} disabled={!code.trim()}>
          Apply
        </Button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}