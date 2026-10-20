import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { toggleProductActive } from "../api/productApi";

const patchProduct = (id, changes) => (data) =>
  data
    ? {
        ...data,
        products: data.products.map((product) =>
          product._id === id ? { ...product, ...changes } : product
        ),
      }
    : data;

// Optimistic isActive toggle with rollback. While a product's request is running
// its id is in pendingIds, so its switch is disabled (no double toggles).
export default function useToggleProduct(setData) {
  const [pendingIds, setPendingIds] = useState([]);

  const toggle = useCallback(
    async (product) => {
      const { _id: id, isActive: previous } = product;

      setPendingIds((ids) => [...ids, id]);
      setData(patchProduct(id, { isActive: !previous }));

      try {
        const updated = await toggleProductActive(id);
        const isActive = updated?.isActive ?? !previous;
        setData(patchProduct(id, { isActive }));
        toast.success(isActive ? "Product activated" : "Product deactivated");
      } catch (error) {
        setData(patchProduct(id, { isActive: previous }));
        toast.error(error.message);
      } finally {
        setPendingIds((ids) => ids.filter((item) => item !== id));
      }
    },
    [setData]
  );

  return { pendingIds, toggle };
}