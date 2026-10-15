import { STATUS_TONES } from "../../data/orderContent";
import { cx } from "../../utils/cx";

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_TONES[status] ?? "bg-neutral-100 text-neutral-700"
      )}
    >
      {status}
    </span>
  );
}