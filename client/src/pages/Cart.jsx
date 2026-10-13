import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import useCartPricing from "../hooks/useCartPricing";
import useCoupon from "../hooks/useCoupon";
import { findLine } from "../utils/cart";
import Seo from "../components/common/Seo";
import FormError from "../components/account/FormError";
import CartIssueBanner from "../components/cart/CartIssueBanner";
import CartItem from "../components/cart/CartItem";
import CartSkeleton from "../components/cart/CartSkeleton";
import CouponInput from "../components/cart/CouponInput";
import OrderSummary from "../components/cart/OrderSummary";
import Reveal from "../components/motion/Reveal";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

function EmptyCart() {
  return (
    <Container className="flex flex-col items-center gap-4 py-16 md:py-24">
      <EmptyState title="Your cart is empty" />
      <Button as={Link} to="/shop">
        Continue shopping
      </Button>
    </Container>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, isReady, totalCount, removeItem, updateQty } = useCart();
  const coupon = useCoupon(items);
  const { pricing, loading, error, issues, reload } = useCartPricing(items, coupon.couponCode);

  const issueByKey = useMemo(
    () => Object.fromEntries(issues.map((issue) => [issue.key, issue])),
    [issues]
  );

  // an empty cart has nothing to discount
  const { couponCode, setCouponCode } = coupon;
  useEffect(() => {
    if (isReady && items.length === 0 && couponCode) setCouponCode("");
  }, [isReady, items.length, couponCode, setCouponCode]);

  // /checkout is a ProtectedRoute: guests are sent to /login and returned afterwards.
  const handleCheckout = () => navigate("/checkout");

  if (!isReady) return <CartSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  const canCheckout = Boolean(pricing) && !loading && !error && issues.length === 0;

  return (
    <>
      <Seo title="Your cart" description="Review the items in your cart." />
      <Container className="pb-16 pt-8 md:pb-24 md:pt-12">
        <Reveal as="h1" className="text-4xl font-light tracking-tight text-ink md:text-5xl">
          Your cart <span className="text-neutral-400">({totalCount})</span>
        </Reveal>

        {location.state?.checkoutError && (
          <div className="mt-6">
            <FormError message={location.state.checkoutError} />
          </div>
        )}
        <CartIssueBanner count={issues.length} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
          <div>
            <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <CartItem
                    key={item.key}
                    item={item}
                    line={findLine(pricing, item, index, items.length)}
                    issue={issueByKey[item.key]}
                    onQty={updateQty}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>
            </ul>
            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              ← Continue shopping
            </Link>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {error && <ErrorState message={error.message} onRetry={reload} />}
            {(pricing || !error) && (
              <OrderSummary
                pricing={pricing}
                loading={loading}
                ctaLabel="Checkout"
                onCta={handleCheckout}
                disabled={!canCheckout}
              >
                <CouponInput
                  applied={coupon.couponCode}
                  error={coupon.couponError}
                  onApply={coupon.applyCoupon}
                  onRemove={coupon.removeCoupon}
                />
              </OrderSummary>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}