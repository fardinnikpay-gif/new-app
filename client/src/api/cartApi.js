import api from "./axios";

// previewCart({ items: [{productId,size,color,qty}], couponCode? }) | the server is the source of truth for prices
export const previewCart = async ({ items, couponCode }, config) => {
  const body = couponCode ? { items, couponCode } : { items };
  const { data } = await api.post("/cart/preview", body, config);
  return data.data; // { lineItems, itemsPrice, discountAmount, shippingPrice, totalPrice }
};