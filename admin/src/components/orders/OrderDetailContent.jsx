import { useCallback } from "react";
import { PackageX } from "lucide-react";
import { getOrder } from "../../api/orderApi";
import useAsync from "../../hooks/useAsync";
import useOrderMutations from "../../hooks/useOrderMutations";
import { ORDER_TRANSITIONS } from "../../utils/constants";
import { formatDateTime } from "../../utils/format";
import { getCustomer, getItemCount, getPaymentLabel, mergeOrder } from "../../utils/order";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import DetailSection from "../common/DetailSection";
import MarkPaidButton from "./MarkPaidButton";
import OrderCustomer from "./OrderCustomer";
import OrderDetailSkeleton from "./OrderDetailSkeleton";
import OrderItemsList from "./OrderItemsList";
import OrderPriceSummary from "./OrderPriceSummary";
import OrderStatusSelect from "./OrderStatusSelect";
import OrderTimeline from "./OrderTimeline";
import PaymentBadge from "./PaymentBadge";
import ShippingAddress from "./ShippingAddress";

// 400 is included because an invalid ObjectId usually fails as a cast error.
const NOT_FOUND_STATUSES = [404, 400];

// preview: the list row, used as a fallback when the detail response has no populated customer.
// It mounts only while the drawer is open, so every open fetches fresh data.
export default function OrderDetailContent({ orderId, preview, onOrderUpdated }) {
  const { data: order, error, reload, setData } = useAsync(
    (signal) => getOrder(orderId, signal),
    [orderId]
  );

  const handleUpdated = useCallback(
    (updated) => {
      setData((current) => (current ? mergeOrder(current, updated) : current));
      onOrderUpdated(updated); // lets the list behind the drawer update its row
    },
    [setData, onOrderUpdated]
  );

  const { pendingIds, changeStatus, markPaid } = useOrderMutations(handleUpdated);

  if (!order) {
    if (error && NOT_FOUND_STATUSES.includes(error.status)) {
      return (
        <EmptyState
          icon={PackageX}
          title="Order not found"
          message="It may have been deleted, or the link is wrong."
        />
      );
    }
    if (error) {
      return <ErrorState title="Could not load the order" message={error.message} onRetry={reload} />;
    }
    return <OrderDetailSkeleton />;
  }

  const pending = pendingIds.includes(order._id);
  const customer = getCustomer(order) ?? getCustomer(preview);
  const canChangeStatus = (ORDER_TRANSITIONS[order.status] ?? []).length > 0;

  return (
    <div>
      <DetailSection title="Status">
        <OrderTimeline status={order.status} createdAt={order.createdAt} />
        {canChangeStatus ? (
          <div className="mt-4 max-w-xs">
            <OrderStatusSelect order={order} pending={pending} onChange={changeStatus} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">This order's status can no longer be changed.</p>
        )}
      </DetailSection>

      <DetailSection title="Payment">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="text-ink">{getPaymentLabel(order.paymentMethod)}</span>
            <PaymentBadge order={order} />
            {order.isPaid && order.paidAt && (
              <span className="text-gray-500">on {formatDateTime(order.paidAt)}</span>
            )}
          </div>
          <MarkPaidButton order={order} pending={pending} onMarkPaid={markPaid} />
        </div>
      </DetailSection>

      <DetailSection title="Customer">
        <OrderCustomer customer={customer} />
      </DetailSection>

      <DetailSection title="Shipping address">
        <ShippingAddress address={order.shippingAddress} />
      </DetailSection>

      <DetailSection title={`Items (${getItemCount(order)})`}>
        <OrderItemsList items={order.items} />
      </DetailSection>

      <DetailSection title="Summary">
        <OrderPriceSummary order={order} />
      </DetailSection>
    </div>
  );
}