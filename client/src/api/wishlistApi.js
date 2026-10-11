import api from "./axios";

export const getWishlist = async (config) => {
  const { data } = await api.get("/wishlist", config);
  return data.data; // { products }
};

// Toggle: adds the product if missing, removes it if present.
export const toggleWishlist = async (productId) => {
  const { data } = await api.post(`/wishlist/${encodeURIComponent(productId)}`);
  return data.data; // { added }
};

export const clearWishlist = async () => {
  await api.delete("/wishlist");
};