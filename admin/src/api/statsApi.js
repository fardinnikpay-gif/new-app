import api from "./axios";

export const getStats = async (signal) => {
  const { data } = await api.get("/admin/stats", { signal });
  return data.data;
};