import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDelivery } from "../../api/deliveryApi";

function AddDelivery() {
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState({
    order: "",
    delivery_person: "",
    delivery_address: "",
    delivery_status: "Preparing",
    delivery_date: "",
  });

  const handleChange = (e) => {
    setDelivery({
      ...delivery,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDelivery(delivery);
      alert("Delivery Added Successfully");
      navigate("/delivery");
    } catch (error) {
      console.log(error);
      alert("Failed to Add Delivery");
    }
  };

  return (
    <div className="add-delivery-container">
      <h2>Add Delivery</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="order"
          placeholder="Order ID"
          value={delivery.order}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="delivery_person"
          placeholder="Delivery Person"
          value={delivery.delivery_person}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={delivery.delivery_status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>

        <input
          type="date"
          name="delivery_date"
          value={delivery.delivery_date}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Delivery</button>
      </form>
    </div>
  );
}

export default AddDelivery;