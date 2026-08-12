
import api from "./api";


// ========================================
// Add Delivery
// ========================================

export const addDelivery = (data) => {
  return api.post(
    "/delivery/",
    data
  );
};


// ========================================
// Get All Deliveries
// ========================================

export const getDeliveries = () => {
  return api.get(
    "/delivery/get_all_deliveries/"
  );
};


// ========================================
// Get Delivery By Order ID
// ========================================

export const getDeliveryByOrderId = (orderId) => {
  return api.get(
    `/delivery/get_delivery_by_order/${orderId}/`
  );
};


// ========================================
// Update Delivery Status
// ========================================

export const updateDelivery = (
  id,
  data
) => {

  return api.put(
    `/delivery/update_delivery/${id}/`,
    data
  );

};


// ========================================
// Delete Delivery
// ========================================

export const deleteDelivery = (id) => {

  return api.delete(
    `/delivery/${id}/`
  );

};


export default api;

