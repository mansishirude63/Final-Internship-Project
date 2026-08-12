import api from "./api";

// Add item to cart
export const addCartItem = (cartData) => {
  return api.post("cart/", cartData);
};

// Get all cart items
export const getCartItems = (userId) => {
  return api.get(`cart/?user=${userId}`);
};

// Get one cart item
export const getCartItem = (id) => {
  return api.get(`cart/${id}/`);
};

// Update cart item
export const updateCartItem = (id, cartData) => {
  return api.put(`cart/${id}/`, cartData);
};

// Delete cart item
export const deleteCartItem = (id) => {
  return api.delete(`cart/${id}/`);
};