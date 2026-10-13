import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getOrderById } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { getPaymentLabel } from "../data/checkoutContent";
import useAsync from "../hooks/useAsync";
import useCouponCode from "../hooks/useCouponCode";
import { formatDate } from "../utils/format";
import { formatOrderNumber } from "../utils/order";
import Seo from "../components/common/Seo";
import OrderItems from "../components/account/OrderItems";
import CartSkeleton from "../components/cart/CartSkeleton";
import OrderSummary from "../components/cart/OrderSummary";
import SuccessMark from "../components/cart/SuccessMark";
import Reveal from "../components/motion/Reveal";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Spinner from "../components/ui/Spinner";

const POLL_MS = 2000;
const MAX_POLLS = 6;
const REDIRECT_DONE_STATUSES = ["succeeded", "processing"];
const NOT_ALLOWED_STATUSES = [403, 404]; // not yours / doesn't exist: same message

function getHeading(order, awaiting, pollsExhausted) {
  if (awaiting && pollsExhausted) {
    return {
      title: "Payment is being processed",
      text: "We'll update your order as soon as the payment is confirmed. You can follow it in your orders.",
    };
  }
  if (awaiting) {
    return { title: "Confirming your payment…", text: "This usually only takes a few seconds." };
  }
  if (order.paymentMethod === "stripe") {
    return { title: "Payment received", text: "Thank you! Your order is confirmed." };
  }
  return {
    title: "Thank you for your order",
    text: "We've received your order and will prepare it for delivery. Pay in cash when it arrives.",
  };
}

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [, setCouponCode] = useCouponCode();
  const { data, error, reload } = useAsync(() => getOrderById(orderId), [orderId]);

  // keep the last good order so polling never flashes a skeleton
  const [order, setOrder] = useState(null);
  const [polls, setPolls] = useState(0);
  useEffect(() => {
    if (data?.order) setOrder(data.order);
  }, [data]);

  // Card payments that redirect (e.g. 3-D Secure) come back here with redirect_status.
  // Only then is the cart cleared, so just viewing an old order never empties the cart.
  useEffect(() => {
    if (!REDIRECT_DONE_STATUSES.includes(searchParams.get("redirect_status"))) return;
    clearCart();
    setCouponCode("");
    setSearchParams({}, { replace: true });
  }, [searchParams, clearCart, setCouponCode, setSearchParams]);

  // The webhook marks card orders as paid a moment later: re-check a few times.
  const awaiting = order?.paymentMethod === "stripe" && !order.isPaid && order.status !== "cancelled";
  useEffect(() => {
    if (!awaiting || polls >= MAX_POLLS) return undefined;
    const timer = setTimeout(() => {
      setPolls((count) => count + 1);
      reload();
    }, POLL_MS);
    return () => clearTimeout(timer);
  }, [awaiting, polls, reload]);

  if (!order && !error) return <CartSkeleton />;

  if (!order) {
    return (
      <Container className="flex flex-col items-center gap-4 py-16 md:py-24">
        {NOT_ALLOWED_STATUSES.includes(error.status) ? (
          <>
            <EmptyState title="Order not found" />
            <Button as={Link} to="/shop">
              Continue shopping
            </Button>
          </>
        ) : (
          <ErrorState message={error.message} onRetry={reload} />
        )}
      </Container>
    );
  }

  const heading = getHeading(order, awaiting, polls >= MAX_POLLS);
  const address = order.shippingAddress;

  return (
    <>
      <Seo title="Order confirmed" description="Your order summary." />
      <Container className="pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="flex flex-col items-center text-center">
          {awaiting ? <Spinner /> : <SuccessMark />}
          <Reveal as="h1" className="mt-6 text-3xl font-light tracking-tight text-ink md:text-5xl">
            {heading.title}
          </Reveal>
          <p className="mt-3 max-w-lg text-neutral-600">{heading.text}</p>
          <p className="mt-4 text-sm text-neutral-600">
            Order <span className="font-medium text-ink">{formatOrderNumber(order)}</span> ·{" "}
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <div className="space-y-10">
            <OrderItems items={order.items} />

            <div className="grid gap-8 text-sm sm:grid-cols-2">
              <div>
                <h2 className="font-medium text-ink">Shipping address</h2>
                <p className="mt-2 text-neutral-600">{address.fullName}</p>
                <p className="text-neutral-600">{address.street}</p>
                <p className="text-neutral-600">
                  {address.city}, {address.postalCode}
                </p>
                <p className="text-neutral-600">{address.phone}</p>
              </div>
              <div>
                <h2 className="font-medium text-ink">Payment</h2>
                <p className="mt-2 text-neutral-600">{getPaymentLabel(order.paymentMethod)}</p>
                <p className="text-neutral-600">{order.isPaid ? "Paid" : "Payment pending"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <OrderSummary pricing={order} />
            <div className="flex flex-col gap-3">
              <Button as={Link} to="/account/orders" size="lg">
                View my orders
              </Button>
              <Button as={Link} to="/shop" size="lg" variant="outline">
                Continue shopping
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}