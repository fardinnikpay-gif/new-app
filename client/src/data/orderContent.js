export const CANCELLABLE_STATUS = "pending";

export const ORDER_STEPS = [
  { value: "pending", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

// Same palette as the admin panel's status badges.
export const STATUS_TONES = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};