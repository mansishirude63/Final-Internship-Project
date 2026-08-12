import api from "./api";

// Register User
export const registerUser = async (userData) => {
  const response = await api.post("/accounts/register_user/", userData);
  return response.data;
};

// Login User
export const loginUser = async (loginData) => {
  const response = await api.post("/accounts/login_user/", loginData);
  return response.data;
};

// Get All Users
export const getAllUsers = async () => {
  const response = await api.get("/accounts/get_all_Users/");
  return response.data;
};

// Get User By ID
export const getUser = async (userId) => {
  const response = await api.get(
    `/accounts/get_user_by_Id/int:user_id/`
  );
  return response.data;
};

// Update User
export const updateUser = async (userId, userData) => {
  const response = await api.put(
    `/accounts/update_User/int:user_id/`,
    userData
  );
  return response.data;
};

// Delete User
export const deleteUser = async (userId) => {
  const response = await api.delete(
    `/accounts/delete_User/int:user_id/`
  );
  return response.data;
};