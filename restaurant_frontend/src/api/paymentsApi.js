import api from "./api";


// Add payment
export const addPayment = (data) => {
    return api.post("/payments/", data);
};


// Get all payments
export const getPayments = () => {
    return api.get("/payments/");
};


// Get payment by id
export const getPaymentById = (id) => {
    return api.get(`/payments/${id}/`);
};


// Update payment
export const updatePayment = (id, data) => {
    return api.put(`/payments/${id}/`, data);
};


// Delete payment
export const deletePayment = (id) => {
    return api.delete(`/payments/${id}/`);
};
