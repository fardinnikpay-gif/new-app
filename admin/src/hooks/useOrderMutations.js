import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { markOrderPaid, updateOrderStatus } from "../api/orderApi";
import { ORDER_STATUS_LABELS } from "../utils/constants";
import { getShortOrderId } from "../utils/order";

// Status / paid actions. onUpdated(updatedOrder) receives the API response.
// Every action resolves to the updated order, or to null after a failure. The server
// message (e.g. an invalid transition) is always shown in a toast.
export default function useOrderMutations(onUpdated) {
  const [pendingIds, setPendingIds] = useState([]);

  const run = useCallback(
    async (id, request, successMessage) => {
      setPendingIds((ids) => [...ids, id]);
      try {
        const updated = await request();
        onUpdated(updated);
        toast.success(successMessage);
        return updated;
      } catch (error) {
        toast.error(error.message);
        return null;
      } finally {
        setPendingIds((ids) => ids.filter((item) => item !== id));
      }
    },
    [onUpdated]
  );

  const changeStatus = useCallback(
    (order, status) =>
      run(
        order._id,
        () => updateOrderStatus(order._id, status),
        `Order #${getShortOrderId(order._id)} is now ${ORDER_STATUS_LABELS[status] ?? status}`
      ),
    [run]
  );

  const markPaid = useCallback(
    (order) =>
      run(
        order._id,
        () => markOrderPaid(order._id),
        `Order #${getShortOrderId(order._id)} marked as paid`
      ),
    [run]
  );

  return { pendingIds, changeStatus, markPaid };
}