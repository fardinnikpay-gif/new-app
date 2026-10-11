import api from "./axios";

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data.data; // { user }
};

export const login = async ({ identifier, password }) => {
  const { data } = await api.post("/auth/login", { identifier, password });
  return data.data; // { user }
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getMe = async (config) => {
  const { data } = await api.get("/auth/me", config);
  return data.data; // { user }
};

export const forgotPassword = async (email) => {
  await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token, password) => {
  const { data } = await api.put(`/auth/reset-password/${encodeURIComponent(token)}`, { password });
  return data.data; // { user }
};