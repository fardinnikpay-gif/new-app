import api from "./axios";

export const createOrder = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return data.data; // { order }
};

export const getMyOrders = async (params, config) => {
  const { data } = await api.get("/orders/my", { ...config, params });
  return data.data; // { orders, pages }
};

export const getOrderById = async (id, config) => {
  const { data } = await api.get(`/orders/${encodeURIComponent(id)}`, config);
  return data.data; // { order }
};

export const cancelOrder = async (id) => {
  const { data } = await api.patch(`/orders/${encodeURIComponent(id)}/cancel`);
  return data.data; // { order }
};