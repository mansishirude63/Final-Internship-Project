import api from "./api";

export const registerUser = (data) => {
    return api.post("accounts/register_user/", data);
}

export const loginUser = (data) => {
    return api.post("accounts/login_user/", data);
}

export const getallUsers = () => {
    return api.get("accounts/get_all_Users/");
}

export const getUser = (id) => {
    return api.get(`accounts/get_user_by_Id/${id}/`);
}

export const updateUser = (id, userData) => {
  return api.put(`accounts/update_User/${id}/`, userData);
};

export const deleteUser = (id) => {
  return api.delete(`accounts/delete_User/${id}/`);
};


export default api;