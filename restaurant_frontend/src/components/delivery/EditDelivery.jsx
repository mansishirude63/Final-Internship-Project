import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDeliveryByOrderId, updateDelivery } from "../../api/deliveryApi";

function EditDelivery() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState({
    order: "",
    delivery_address: "",
    delivery_person: "",
    status: "Preparing",
    delivery_date: "",
  });

  useEffect(() => {
    fetchDelivery();
  }, []);

  const fetchDelivery = async () => {
    try {
      const response = await getDeliveryByOrderId(id);

      setDelivery({
        order: response.data.order,
        delivery_person: response.data.delivery_person,
        address: response.data.delivery_address,
        status: response.data.delivery_status,
        delivery_date: response.data.delivery_date,
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load delivery");
    }
  };

  const handleChange = (e) => {
    setDelivery({
      ...delivery,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDelivery(id, delivery);
      alert("Delivery Updated Successfully");
      navigate("/delivery");
    } catch (error) {
      console.log(error);
      alert("Failed to update delivery");
    }
  };

  return (
    <div className="edit-delivery-container">
      <h2>Edit Delivery</h2>

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
          value={delivery.status}
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

        <button type="submit">Update Delivery</button>
      </form>
    </div>
  );
}

export default EditDelivery;