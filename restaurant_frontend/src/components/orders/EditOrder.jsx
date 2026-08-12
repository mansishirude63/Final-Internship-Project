import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllOrders, updateOrder } from "../../api/ordersApi";

function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    user: "",
    total_amount: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await getAllOrders(id);

      setOrder({
        user: response.data.user,
        total_amount: response.data.total_amount,
        status: response.data.status,
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load order");
    }
  };

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateOrder(id, order);
      alert("Order Updated Successfully");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert("Failed to update order");
    }
  };

  return (
    <div className="edit-order-container">
      <h2>Edit Order</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="user"
          placeholder="User ID"
          value={order.user}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="total_amount"
          placeholder="Total Amount"
          value={order.total_amount}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={order.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit">Update Order</button>
      </form>
    </div>
  );
}

export default EditOrder;