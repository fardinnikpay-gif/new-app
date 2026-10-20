import { Mail, Pencil, Trash2 } from "lucide-react";
import { isExpired } from "../../utils/coupon";
import IconButton from "../ui/IconButton";

// Sending a code that customers cannot use is pointless, so Send is disabled
// for inactive or expired coupons.
export default function CouponRowActions({ coupon, onEdit, onSend, onDelete }) {
  const canSend = coupon.isActive && !isExpired(coupon.expiresAt);

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton icon={Pencil} label={`Edit coupon ${coupon.code}`} onClick={() => onEdit(coupon)} />
      <IconButton
        icon={Mail}
        label={
          canSend
            ? `Send coupon ${coupon.code} by email`
            : `Coupon ${coupon.code} cannot be sent: it is inactive or expired`
        }
        disabled={!canSend}
        onClick={() => onSend(coupon)}
      />
      <IconButton
        icon={Trash2}
        tone="danger"
        label={`Delete coupon ${coupon.code}`}
        onClick={() => onDelete(coupon)}
      />
    </div>
  );
}