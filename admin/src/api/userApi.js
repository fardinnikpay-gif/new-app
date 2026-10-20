import api from "./axios";

export const getAdminUsers = async (params, signal) => {
  const { data } = await api.get("/admin/users", { params, signal });
  return data.data; // { users, total, pages }
};

export const getAdminUser = async (id, signal) => {
  const { data } = await api.get(`/admin/users/${id}`, { signal });
  return data.data; // { user, ordersCount }
};

export const deleteUser = async (id) => {
  await api.delete(`/admin/users/${id}`);
};