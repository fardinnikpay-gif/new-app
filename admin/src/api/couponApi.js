import api from "./axios";

export const getCoupons = async (signal) => {
  const { data } = await api.get("/coupons", { signal });
  return data.data.coupons;
};

// payload: { code, type, value, minOrder, maxUses, expiresAt, isActive }
export const createCoupon = async (payload) => {
  const { data } = await api.post("/coupons", payload);
  return data.data.coupon;
};

export const updateCoupon = async (id, payload) => {
  const { data } = await api.put(`/coupons/${id}`, payload);
  return data.data.coupon;
};

export const deleteCoupon = async (id) => {
  await api.delete(`/coupons/${id}`);
};

export const sendCoupon = async (id, emails) => {
  const { data } = await api.post(`/coupons/${id}/send`, { emails });
  return data.data.sent;
};