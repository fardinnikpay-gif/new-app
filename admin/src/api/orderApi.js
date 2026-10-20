import api from "./axios";

export const getAdminOrders = async (params, signal) => {
  const { data } = await api.get("/admin/orders", { params, signal });
  return data.data; // { orders, total, pages }
};

export const getOrder = async (id, signal) => {
  const { data } = await api.get(`/orders/${id}`, { signal });
  return data.data.order;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`/admin/orders/${id}/status`, { status });
  return data.data.order;
};

export const markOrderPaid = async (id) => {
  const { data } = await api.patch(`/admin/orders/${id}/paid`);
  return data.data.order;
};