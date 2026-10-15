// Orders have no separate number, so the last 8 characters of the id are used.
export const formatOrderNumber = (orderOrId) => {
  const id = typeof orderOrId === "string" ? orderOrId : orderOrId?._id;
  return `#${String(id ?? "").slice(-8).toUpperCase()}`;
};

export const getOrderItemCount = (order) =>
  (order.items ?? []).reduce((sum, item) => sum + item.qty, 0);