import api from "./api";


// Place order
export const placeOrder = (data) => {
    return api.post("/orders/place_order/", data);
};



// Get all orders (Staff/Admin)
export const getAllOrders = () => {
    return api.get("/orders/get_all_orders/");
};



// Get orders of logged-in user (Customer)
export const getUserOrders = (userId) => {
    return api.get(
        `/orders/get_user_orders/${userId}/`
    );
};



// Get order by id
export const getOrderById = (id) => {
    return api.get(
        `/orders/get_order_by_id/${id}/`
    );
};



// Update order
export const updateOrder = (id, data) => {
    return api.put(
        `/orders/update_order/${id}/`,
        data
    );
};



// Delete order
export const deleteOrder = (id) => {
    return api.delete(
        `/orders/delete_order/${id}/`
    );
};


export default api;