import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { DEFAULT_PAYMENT_METHOD, isPaymentEnabled } from "../data/checkoutContent";
import useCardPayment from "../hooks/useCardPayment";
import useCartPricing from "../hooks/useCartPricing";
import useCheckoutAddress from "../hooks/useCheckoutAddress";
import useCoupon from "../hooks/useCoupon";
import usePlaceOrder from "../hooks/usePlaceOrder";
import Seo from "../components/common/Seo";
import CartIssueBanner from "../components/cart/CartIssueBanner";
import CartSkeleton from "../components/cart/CartSkeleton";
import AddressSection from "../components/cart/AddressSection";
import CardPaymentSection from "../components/cart/CardPaymentSection";
import CheckoutSummary from "../components/cart/CheckoutSummary";
import PaymentMethodSection from "../components/cart/PaymentMethodSection";
import Reveal from "../components/motion/Reveal";
import Container from "../components/ui/Container";
import ErrorState from "../components/ui/ErrorState";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, isReady, clearCart } = useCart();
  const coupon = useCoupon(items);
  const address = useCheckoutAddress();
  const card = useCardPayment();
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD);
  const { pricing, loading, error, issues, reload } = useCartPricing(items, coupon.couponCode);
  const { placeOrder, placing, error: placeError, stockProblem } = usePlaceOrder();
  const orderPlacedRef = useRef(false);
  const submitLockRef = useRef(false);

  const paymentLocked = card.active; // the order exists and the card form is shown
  const busy = placing || card.loading;

  // stock changed while ordering: back to the cart, where each item shows its own warning
  useEffect(() => {
    if (stockProblem) navigate("/cart", { replace: true, state: { checkoutError: placeError } });
  }, [stockProblem, placeError, navigate]);

  // The cart is cleared only after the order is really done (COD placed / card paid).
  const finishOrder = (orderId) => {
    orderPlacedRef.current = true; // an empty cart after this point is expected
    coupon.setCouponCode("");
    clearCart();
    navigate(`/checkout/success/${orderId}`, { replace: true });
  };

  const handlePlaceOrder = async () => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;

    const order = await placeOrder(address.shippingAddress, paymentMethod, coupon.couponCode);
    if (!order) {
      submitLockRef.current = false;
      return;
    }
    if (paymentMethod === "cod") finishOrder(order._id);
    else await card.start(order._id); // the lock stays on: the card form takes over from here
  };

  if (!isReady) return <CartSkeleton />;
  if (items.length === 0) {
    return orderPlacedRef.current ? null : <Navigate to="/cart" replace />;
  }

  const canPlace =
    Boolean(pricing) &&
    !loading &&
    !error &&
    issues.length === 0 &&
    Boolean(address.shippingAddress) &&
    isPaymentEnabled(paymentMethod) &&
    !busy;

  const hint = address.shippingAddress ? "" : "Choose or add a shipping address to continue.";

  return (
    <>
      <Seo title="Checkout" description="Complete your order." />
      <Container className="pb-16 pt-8 md:pb-24 md:pt-12">
        <Reveal as="h1" className="text-4xl font-light tracking-tight text-ink md:text-5xl">
          Checkout
        </Reveal>

        {!paymentLocked && (
          <>
            <CartIssueBanner count={issues.length} />
            {issues.length > 0 && (
              <Link
                to="/cart"
                className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Review your cart
              </Link>
            )}
          </>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_26rem] lg:gap-16">
          <div className="space-y-12">
            {paymentLocked ? (
              <CardPaymentSection
                orderId={card.orderId}
                clientSecret={card.clientSecret}
                loading={card.loading}
                error={card.error}
                onRetry={card.retry}
                onSuccess={() => finishOrder(card.orderId)}
              />
            ) : (
              <>
                <AddressSection {...address} />
                <PaymentMethodSection value={paymentMethod} onChange={setPaymentMethod} />
              </>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {error && <ErrorState message={error.message} onRetry={reload} />}
            {(pricing || !error) && (
              <CheckoutSummary
                items={items}
                pricing={pricing}
                loading={loading}
                placing={busy}
                canPlace={canPlace}
                onPlace={handlePlaceOrder}
                locked={paymentLocked}
                hint={hint}
                error={placeError}
                coupon={{
                  applied: coupon.couponCode,
                  error: coupon.couponError,
                  onApply: coupon.applyCoupon,
                  onRemove: coupon.removeCoupon,
                }}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}