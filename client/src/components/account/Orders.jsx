import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import useAsync from "../../hooks/useAsync";
import useMediaQuery from "../../hooks/useMediaQuery";
import Seo from "../../components/common/Seo";
import Pagination from "../../components/common/Pagination";
import AccountSection from "../../components/account/AccountSection";
import OrderListItem from "../../components/account/OrderListItem";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Skeleton from "../../components/ui/Skeleton";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const parsePage = (value) => {
  const page = parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const topRef = useRef(null);
  const isFirstRender = useRef(true);

  const { data, loading, error, reload } = useAsync(() => getMyOrders({ page }), [page]);
  const orders = data?.orders ?? [];

  const goToPage = (next) => setSearchParams(next === 1 ? {} : { page: String(next) });

  // if the page is out of range (e.g. orders changed), go to the last page
  useEffect(() => {
    if (data && data.pages > 0 && page > data.pages) {
      setSearchParams(data.pages === 1 ? {} : { page: String(data.pages) }, { replace: true });
    }
  }, [data, page, setSearchParams]);

  // bring the list into view when the page changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    // only when the page number changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  let body;
  if (loading) {
    body = (
      <div aria-busy="true" className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  } else if (error) {
    body = <ErrorState message={error.message} onRetry={reload} />;
  } else if (!orders.length) {
    body = (
      <div className="flex flex-col items-start gap-4">
        <EmptyState title="No orders yet" />
        <Button as={Link} to="/shop">
          Start shopping
        </Button>
      </div>
    );
  } else {
    body = (
      <>
        <ul className="space-y-4">
          {orders.map((order) => (
            <OrderListItem key={order._id} order={order} />
          ))}
        </ul>
        <Pagination page={page} pages={data.pages} onChange={goToPage} />
      </>
    );
  }

  return (
    <>
      <Seo title="My orders" description="Your order history." />
      <div ref={topRef} className="scroll-mt-24">
        <AccountSection title="Orders" description="Track and review your orders." narrow={false}>
          {body}
        </AccountSection>
      </div>
    </>
  );
}