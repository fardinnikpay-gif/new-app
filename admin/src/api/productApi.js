import api from "./axios";

// FormData: do not set Content-Type manually; the browser adds the boundary.

export const getAdminProducts = async (params, signal) => {
  const { data } = await api.get("/admin/products", { params, signal });
  return data.data; // { products, total, pages }
};

export const getAdminProduct = async (id, signal) => {
  const { data } = await api.get(`/admin/products/${id}`, { signal });
  return data.data.product;
};

export const createProduct = async (formData) => {
  const { data } = await api.post("/products", formData);
  return data.data.product;
};

export const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/products/${id}`, formData);
  return data.data.product;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export const toggleProductActive = async (id) => {
  const { data } = await api.patch(`/products/${id}/toggle-active`);
  return data.data.product;
};