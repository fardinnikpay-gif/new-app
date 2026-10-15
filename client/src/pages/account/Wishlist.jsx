import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { clearWishlist } from "../../api/wishlistApi";
import { useWishlist } from "../../context/WishlistContext";
import Seo from "../../components/common/Seo";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AccountSection from "../../components/account/AccountSection";
import WishlistItem from "../../components/account/WishlistItem";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Skeleton from "../../components/ui/Skeleton";

const SKELETON_COUNT = 6;
const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3";

export default function Wishlist() {
  const { ids, products, toggle, load } = useWishlist();
  const reduceMotion = useReducedMotion();
  const loadRef = useRef(load); // `load` may change identity between renders
  loadRef.current = load;

  const [status, setStatus] = useState({ loading: true, error: null });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cleared, setCleared] = useState(false); // optimistic "Clear all"

  const loadList = useCallback(async () => {
    setStatus({ loading: true, error: null });
    try {
      await loadRef.current();
      setStatus({ loading: false, error: null });
    } catch (error) {
      setStatus({ loading: false, error });
    }
  }, []);

  useEffect(() => {
    loadList(); // always refresh when the page opens
  }, [loadList]);

  // single source of truth: ids decides what is shown, so heart clicks and Remove behave the same
  const items = useMemo(
    () => (cleared ? [] : (products ?? []).filter((product) => ids.has(product._id))),
    [cleared, products, ids]
  );

  const handleRemove = (product) => {
    // toggle() is optimistic and rolls back by itself if the request fails
    Promise.resolve(toggle(product._id)).catch(() =>
      toast.error("Couldn't update your wishlist. Please try again.")
    );
  };

  const handleClear = async () => {
    setConfirmOpen(false);
    setCleared(true); // optimistic: the grid empties right away

    try {
      await clearWishlist();
    } catch (error) {
      setCleared(false); // rollback
      toast.error(error.message || "Couldn't clear your wishlist.");
      return;
    }

    try {
      await loadRef.current(); // syncs ids, so hearts elsewhere update too
      setCleared(false);
    } catch {
      // already empty on the server; keep showing the empty state
    }
  };

  let body;
  if (status.loading && items.length === 0 && !(products ?? []).length) {
    body = (
      <div aria-busy="true" className={GRID}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <Skeleton key={i} className="aspect-4/5 w-full" />
        ))}
      </div>
    );
  } else if (status.error && items.length === 0) {
    body = <ErrorState message={status.error.message} onRetry={loadList} />;
  } else if (items.length === 0) {
    body = (
      <div className="flex flex-col items-start gap-4">
        <EmptyState title="Your wishlist is empty" />
        <Button as={Link} to="/shop">
          Discover products
        </Button>
      </div>
    );
  } else {
    body = (
      <>
        <div className="mb-6 flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-sm text-neutral-600">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
          <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)}>
            Clear all
          </Button>
        </div>
        <ul className={GRID}>
          <AnimatePresence mode="popLayout">
            {items.map((product,index) => (
              <WishlistItem
                key={product._id}
                product={product}
                index={index}
                onRemove={handleRemove}
                reduceMotion={reduceMotion}
              />
            ))}
          </AnimatePresence>
        </ul>
      </>
    );
  }

  return (
    <>
      <Seo title="Wishlist" description="The products you've saved." />
      <AccountSection title="Wishlist" description="Products you've saved for later." narrow={false}>
        {body}
      </AccountSection>

      <ConfirmDialog
        open={confirmOpen}
        title="Clear your wishlist?"
        message={`All ${items.length} ${items.length === 1 ? "item" : "items"} will be removed from your wishlist.`}
        confirmLabel="Clear all"
        cancelLabel="Keep them"
        onConfirm={handleClear}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}