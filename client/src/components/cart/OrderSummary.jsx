import { cx } from "../../utils/cx";
import { formatPrice } from "../../utils/format";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";

function Row({ label, value, strong }) {
  return (
    <div className={cx("flex justify-between", strong ? "text-base font-medium text-ink" : "text-neutral-600")}>
      <dt>{label}</dt>
      <dd className={strong ? undefined : "text-ink"}>{value}</dd>
    </div>
  );
}

// children is the slot for the coupon input (reused by Checkout).
export default function OrderSummary({ pricing, loading, ctaLabel, onCta, disabled, ctaLoading, children }) {
  return (
    <aside aria-label="Order summary" className="rounded-lg border border-neutral-200 p-6">
      <h2 className="text-lg font-medium text-ink">Order summary</h2>

      <dl aria-live="polite" className={cx("mt-6 space-y-3 text-sm", loading && "opacity-60")}>
        {pricing ? (
          <>
            <Row label="Subtotal" value={formatPrice(pricing.itemsPrice)} />
            {pricing.discountAmount > 0 && (
              <Row label="Discount" value={`−${formatPrice(pricing.discountAmount)}`} />
            )}
            <Row
              label="Shipping"
              value={pricing.shippingPrice > 0 ? formatPrice(pricing.shippingPrice) : "Free"}
            />
            <div className="border-t border-neutral-200 pt-3">
              <Row strong label="Total" value={formatPrice(pricing.totalPrice)} />
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-6 w-full" />
          </>
        )}
      </dl>

      {children && <div className="mt-6">{children}</div>}

      {onCta && (
        <Button size="lg" className="mt-6 w-full" onClick={onCta} disabled={disabled} loading={ctaLoading}>
          {ctaLabel}
        </Button>
      )}
    </aside>
  );
}