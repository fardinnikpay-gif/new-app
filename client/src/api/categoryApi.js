import api from "./axios";

export const getCategories = async (config) => {
  const { data } = await api.get("/categories", config);
  return data.data; // { categories }
};