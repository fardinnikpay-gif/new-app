import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { cancelOrder, getOrderById } from "../../api/orderApi";
import { CANCELLABLE_STATUS } from "../../data/orderContent";
import { getPaymentLabel } from "../../data/checkoutContent";
import useAsync from "../../hooks/useAsync";
import { formatDate } from "../../utils/format";
import { formatOrderNumber } from "../../utils/order";
import Seo from "../../components/common/Seo";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AccountSection from "../../components/account/AccountSection";
import OrderItems from "../../components/account/OrderItems";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";
import OrderTimeline from "../../components/account/OrderTimeline";
import OrderSummary from "../../components/cart/OrderSummary";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Skeleton from "../../components/ui/Skeleton";

const NOT_ALLOWED_STATUSES = [403, 404]; // not yours / doesn't exist: same message

export default function OrderDetail() {
  const { id } = useParams();
  const { data, error, reload } = useAsync(() => getOrderById(id), [id]);
  const [order, setOrder] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setOrder(data?.order ?? null);
  }, [data]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const { order: updated } = await cancelOrder(id);
      setOrder(updated);
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.message || "Could not cancel this order.");
    } finally {
      setCancelling(false);
      setConfirmOpen(false);
    }
  };

  if (!order && !error) {
    return (
      <div aria-busy="true" className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return NOT_ALLOWED_STATUSES.includes(error.status) ? (
      <div className="flex flex-col items-start gap-4">
        <EmptyState title="Order not found" />
        <Button as={Link} to="/account/orders">
          Back to orders
        </Button>
      </div>
    ) : (
      <ErrorState message={error.message} onRetry={reload} />
    );
  }

  const address = order.shippingAddress;
  const number = formatOrderNumber(order);

  return (
    <>
      <Seo title={`Order ${number}`} description="Order details." />
      <AccountSection title={`Order ${number}`} narrow={false}>
        <Link
          to="/account/orders"
          className="-mt-4 mb-6 inline-flex min-h-11 items-center text-sm text-neutral-600 underline-offset-4 hover:text-ink hover:underline"
        >
          ← All orders
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          <OrderStatusBadge status={order.status} />
          <span>Placed on {formatDate(order.createdAt)}</span>
        </div>

        <div className="mt-8">
          <OrderTimeline status={order.status} />
        </div>

        <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_20rem]">
          <div className="space-y-10">
            <OrderItems items={order.items} />

            <div className="grid gap-8 text-sm sm:grid-cols-2">
              <div>
                <h3 className="font-medium text-ink">Shipping address</h3>
                <p className="mt-2 text-neutral-600">{address.fullName}</p>
                <p className="text-neutral-600">{address.street}</p>
                <p className="text-neutral-600">
                  {address.city}, {address.postalCode}
                </p>
                <p className="text-neutral-600">{address.phone}</p>
              </div>
              <div>
                <h3 className="font-medium text-ink">Payment</h3>
                <p className="mt-2 text-neutral-600">{getPaymentLabel(order.paymentMethod)}</p>
                <p className="text-neutral-600">
                  {order.isPaid
                    ? `Paid${order.paidAt ? ` on ${formatDate(order.paidAt)}` : ""}`
                    : "Payment pending"}
                </p>
                {order.couponCode && (
                  <p className="text-neutral-600">Coupon: {order.couponCode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <OrderSummary pricing={order} />
            {order.status === CANCELLABLE_STATUS && (
              <Button variant="outline" className="w-full" onClick={() => setConfirmOpen(true)}>
                Cancel order
              </Button>
            )}
          </div>
        </div>
      </AccountSection>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this order?"
        message="This can't be undone."
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        onConfirm={handleCancel}
        onClose={() => setConfirmOpen(false)}
        loading={cancelling}
      />
    </>
  );
}