import api from "./axios";

export const createPaymentIntent = async (orderId) => {
  const { data } = await api.post("/payments/intent", { orderId });
  return data.data; // { clientSecret }
};