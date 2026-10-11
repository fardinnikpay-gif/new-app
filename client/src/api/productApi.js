import api from "./axios";

export const getProducts = async (params, config) => {
  const { data } = await api.get("/products", { ...config, params });
  return data.data; // { products, total, pages, page }
};

export const getFeaturedProducts = async (config) => {
  const { data } = await api.get("/products/featured", config);
  return data.data; // { products }
};

export const getNewArrivals = async (config) => {
  const { data } = await api.get("/products/new-arrivals", config);
  return data.data; // { products }
};

export const getBrands = async (config) => {
  const { data } = await api.get("/products/brands", config);
  return data.data; // { brands }
};

export const getProductBySlug = async (slug, config) => {
  const { data } = await api.get(`/products/${encodeURIComponent(slug)}`, config);
  return data.data; // { product }
};

export const getRelatedProducts = async (slug, config) => {
  const { data } = await api.get(`/products/${encodeURIComponent(slug)}/related`, config);
  return data.data; // { products }
};