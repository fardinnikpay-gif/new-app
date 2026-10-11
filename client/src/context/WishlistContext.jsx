import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getWishlist, toggleWishlist } from "../api/wishlistApi";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

const EMPTY_IDS = new Set();
const EMPTY_PRODUCTS = [];
const INITIAL_DATA = { ownerId: null, ids: EMPTY_IDS, products: EMPTY_PRODUCTS, error: null };

// withSaved(data, userId, productId, saved, product?) | pure update for optimistic changes and rollbacks
function withSaved(data, userId, productId, saved, product) {
  if (data.ownerId !== userId) return data;

  const ids = new Set(data.ids);
  let products = data.products;

  if (saved) {
    ids.add(productId);
    if (product && !products.some((item) => item._id === productId)) products = [product, ...products];
  } else {
    ids.delete(productId);
    products = products.filter((item) => item._id !== productId);
  }

  return { ...data, ids, products };
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = user?._id ?? null;

  const [data, setData] = useState(INITIAL_DATA);
  const dataRef = useRef(data);
  const pendingRef = useRef(new Set());

  useEffect(() => {
    dataRef.current = data;
  });

  // load(config?) | fetches the wishlist of the current user
  const load = useCallback(
    async (config) => {
      if (!userId) return;
      try {
        const { products } = await getWishlist(config);
        setData({ ownerId: userId, ids: new Set(products.map((item) => item._id)), products, error: null });
      } catch (error) {
        if (error.canceled) return;
        setData((prev) => ({
          ownerId: userId,
          ids: prev.ownerId === userId ? prev.ids : EMPTY_IDS,
          products: prev.ownerId === userId ? prev.products : EMPTY_PRODUCTS,
          error,
        }));
      }
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) return undefined;
    const controller = new AbortController();
    load({ signal: controller.signal });
    return () => controller.abort();
  }, [userId, load]);

  // toggle(productId, product?) | out: { requiresLogin } | { pending } | { added } | { error }
  const toggle = useCallback(
    async (productId, product) => {
      if (!userId) {
        toast("Please log in to save favorites.");
        navigate("/login", { state: { from: location } });
        return { requiresLogin: true };
      }
      if (pendingRef.current.has(productId)) return { pending: true };
      pendingRef.current.add(productId);

      const current = dataRef.current;
      const wasSaved = current.ids.has(productId);
      const removedProduct = current.products.find((item) => item._id === productId);

      setData((prev) => withSaved(prev, userId, productId, !wasSaved, product));

      try {
        const { added } = await toggleWishlist(productId);
        if (added !== !wasSaved) {
          setData((prev) => withSaved(prev, userId, productId, added, product ?? removedProduct));
        }
        return { added };
      } catch (error) {
        setData((prev) => withSaved(prev, userId, productId, wasSaved, removedProduct));
        toast.error(error.message);
        return { error };
      } finally {
        pendingRef.current.delete(productId);
      }
    },
    [userId, navigate, location]
  );

  // Data of a previous user is ignored automatically (no reset needed on logout)
  const isOwned = data.ownerId === userId;
  const ids = isOwned ? data.ids : EMPTY_IDS;
  const products = isOwned ? data.products : EMPTY_PRODUCTS;
  const error = isOwned ? data.error : null;
  const loading = Boolean(userId) && !isOwned;

  const value = useMemo(
    () => ({ ids, products, loading, error, toggle, load }),
    [ids, products, loading, error, toggle, load]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}