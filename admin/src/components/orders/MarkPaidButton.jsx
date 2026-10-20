import { useState } from "react";
import { Banknote } from "lucide-react";
import { formatPrice } from "../../utils/format";
import { canMarkPaid, getShortOrderId } from "../../utils/order";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";

// Renders only for unpaid cash-on-delivery orders. onMarkPaid(order) resolves to the
// updated order, or to null when it failed (the dialog then stays open for a retry).
export default function MarkPaidButton({ order, pending = false, onMarkPaid }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = async () => {
    const updated = await onMarkPaid(order);
    if (updated) setConfirmOpen(false);
  };

  return (
    <>
      {canMarkPaid(order) && (
        <Button variant="outline" onClick={() => setConfirmOpen(true)} disabled={pending}>
          <Banknote className="size-4" aria-hidden="true" />
          Mark as paid
        </Button>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Mark order as paid?"
        message={`Confirm that the cash payment of ${formatPrice(order.totalPrice)} for order #${getShortOrderId(order._id)} was received. This cannot be undone from the panel.`}
        confirmLabel="Mark as paid"
        tone="primary"
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
        loading={pending}
      />
    </>
  );
}