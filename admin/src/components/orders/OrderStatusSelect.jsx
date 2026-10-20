import { useState } from "react";
import { CANCELLED_STATUS, ORDER_STATUS_LABELS, ORDER_TRANSITIONS } from "../../utils/constants";
import { getShortOrderId } from "../../utils/order";
import StatusBadge from "../common/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";
import Spinner from "../ui/Spinner";

const SELECT_CLASS =
  "min-w-32 flex-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-ink disabled:bg-gray-100 disabled:text-gray-500";

const getLabel = (status) => ORDER_STATUS_LABELS[status] ?? status;
const stopPropagation = (event) => event.stopPropagation();

// Shows only the logical next statuses. Cancelling asks for confirmation first.
// onChange(order, status) must resolve to the updated order, or to null when it failed.
// Orders with no possible next status (delivered, cancelled) show a plain badge.
export default function OrderStatusSelect({ order, onChange, pending = false }) {
  const [requested, setRequested] = useState(null); // shown while the request is running
  const [confirmOpen, setConfirmOpen] = useState(false);
  const nextStatuses = ORDER_TRANSITIONS[order.status] ?? [];
  const number = getShortOrderId(order._id);

  const handleChange = async (event) => {
    const next = event.target.value;
    if (next === order.status) return;

    if (next === CANCELLED_STATUS) {
      setConfirmOpen(true);
      return;
    }
    setRequested(next);
    await onChange(order, next);
    setRequested(null); // back to the real status (the new one on success, the old on failure)
  };

  const handleConfirmCancel = async () => {
    const updated = await onChange(order, CANCELLED_STATUS);
    if (updated) setConfirmOpen(false); // stays open on failure so the admin can retry
  };

  return (
    <div className="flex items-center gap-2">
      {nextStatuses.length === 0 ? (
        <StatusBadge status={order.status} />
      ) : (
        <>
          <select
            aria-label={`Status of order #${number}`}
            value={requested ?? order.status}
            disabled={pending}
            onChange={handleChange}
            className={SELECT_CLASS}
          >
            <option value={order.status}>{getLabel(order.status)}</option>
            {nextStatuses.map((status) => (
              <option key={status} value={status}>
                {getLabel(status)}
              </option>
            ))}
          </select>
          {pending && <Spinner size="sm" className="text-primary" />}
        </>
      )}

      {/* The dialog is a portal, but React events still bubble through the React tree:
          without this, clicking the dialog would reach the table row and open the drawer. */}
      <span className="contents" onClick={stopPropagation}>
        <ConfirmDialog
          open={confirmOpen}
          title="Cancel this order?"
          message={`Order #${number} will be marked as cancelled. This cannot be undone.`}
          confirmLabel="Cancel order"
          cancelLabel="Keep order"
          tone="danger"
          onConfirm={handleConfirmCancel}
          onClose={() => setConfirmOpen(false)}
          loading={pending}
        />
      </span>
    </div>
  );
}