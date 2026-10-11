import api from "./axios";

export const updateProfile = async ({ name, phone }) => {
  const { data } = await api.put("/users/profile", { name, phone });
  return data.data; // { user }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  await api.put("/users/password", { currentPassword, newPassword });
};

export const addAddress = async (payload) => {
  const { data } = await api.post("/users/addresses", payload);
  return data.data; // { addresses }
};

export const updateAddress = async (id, payload) => {
  const { data } = await api.put(`/users/addresses/${encodeURIComponent(id)}`, payload);
  return data.data; // { addresses }
};

export const deleteAddress = async (id) => {
  const { data } = await api.delete(`/users/addresses/${encodeURIComponent(id)}`);
  return data.data; // { addresses }
};