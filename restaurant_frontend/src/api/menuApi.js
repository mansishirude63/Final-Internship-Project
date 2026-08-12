import api from "./api";

// Add menu item
export const addMenu = (menuData) => {
  return api.post("menu/add_menu/", menuData);
};

// Get all menu items
export const getMenus = () => {
  return api.get("menu/get_menu/");
};

// Get one menu item
export const getMenu = (id) => {
  return api.get(`menu/get_menu_item/${id}/`);
};

// Update menu item
export const updateMenu = (id, menuData) => {
  return api.put(`menu/update_menu/${id}/`, menuData);
};

// Delete menu item
export const deleteMenu = (id) => {
  return api.delete(`menu/delete_menu/${id}/`);
};


export default api;
