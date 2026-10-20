import {
  CANCELLED_STATUS,
  COD_PAYMENT_METHOD,
  ORDER_NUMBER_LENGTH,
  PAYMENT_METHOD_LABELS,
} from "./constants";

const isObject = (value) => value !== null && typeof value === "object";

// The order number shown in the UI is the last 8 characters of the Mongo _id.
export const getShortOrderId = (id) => String(id ?? "").slice(-ORDER_NUMBER_LENGTH);

// The populated customer { name, email, phone }, or null when the API sent only an id.
export const getCustomer = (order) => (isObject(order?.user) ? order.user : null);

export const getCustomerName = (order) => {
  const customer = getCustomer(order);
  return customer?.name || customer?.email || "";
};

export const getItemCount = (order) =>
  (order?.items ?? []).reduce((sum, item) => sum + (Number(item?.qty) || 0), 0);

export const getPaymentLabel = (method) => PAYMENT_METHOD_LABELS[method] ?? method ?? "-";

// "Mark as paid" is only for unpaid cash-on-delivery orders that are not cancelled.
export const canMarkPaid = (order) =>
  order?.paymentMethod === COD_PAYMENT_METHOD && !order.isPaid && order.status !== CANCELLED_STATUS;

// An update response may carry `user` as a plain id: keep the populated customer we already have.
export const mergeOrder = (previous, updated) => ({
  ...previous,
  ...updated,
  user: isObject(updated?.user) ? updated.user : previous?.user,
});