import axios from "axios";

const API_URL = "https://final-internship-project-kcp1.onrender.com/api/group_order";


export const createGroupOrder = async (
    userId,
    budget
) => {

    const response = await axios.post(
        `${API_URL}/create/`,
        {
            user: userId,
            budget: budget
        }
    );

    return response.data;
};


export const joinGroupOrder = async (groupCode, userId) => {
    const response = await axios.post(
        `${API_URL}/join/`,
        {
            group_code: groupCode,
            user: userId
        }
    );

    return response.data;
};


export const getGroupOrder = async (groupCode) => {
    const response = await axios.get(
        `${API_URL}/${groupCode}/`
    );

    return response.data;
};


export const leaveGroupOrder = async (groupCode, userId) => {
    const response = await axios.post(
        `${API_URL}/leave/`,
        {
            group_code: groupCode,
            user: userId
        }
    );

    return response.data;
};


export const addGroupCartItem = async (
    groupCode,
    userId,
    menuId,
    quantity
) => {
    const response = await axios.post(
        `${API_URL}/cart/add/`,
        {
            group_code: groupCode,
            user: userId,
            menu: menuId,
            quantity: quantity
        }
    );

    return response.data;
};


export const getGroupCart = async (groupCode) => {
    const response = await axios.get(
        `${API_URL}/cart/${groupCode}/`
    );

    return response.data;
};


export const placeGroupOrder = async (groupCode, userId) => {

    const response = await axios.post(
        `${API_URL}/place_order/`,
        {
            group_code: groupCode,
            user: userId
        }
    );

    return response.data;
};

export const removeGroupCartItem = async (itemId) => {
    const response = await axios.delete(
        `${API_URL}/cart/remove/${itemId}/`
    );

    return response.data;
};