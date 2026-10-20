import api from "./axios";

export const login = async (identifier, password) => {
  const { data } = await api.post("/auth/login", { identifier, password });
  return data.data.user;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getMe = async (signal) => {
  const { data } = await api.get("/auth/me", { signal });
  return data.data.user;
};