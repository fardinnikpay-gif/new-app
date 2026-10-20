import api from "./axios";

export const getCategories = async (signal) => {
  const { data } = await api.get("/categories", { signal });
  return data.data.categories;
};

// formData must contain the "image" file.
export const updateCategory = async (id, formData) => {
  const { data } = await api.put(`/categories/${id}`, formData);
  return data.data.category;
};