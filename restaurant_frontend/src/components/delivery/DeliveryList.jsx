import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDeliveries,
  deleteDelivery,
} from "../../api/deliveryApi";

function DeliveryList() {
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await getDeliveries();
      setDeliveries(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load deliveries");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this delivery?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDelivery(id);
      fetchDeliveries();
    } catch (error) {
      console.log(error);
      alert("Failed to delete delivery");
    }
  };

  return (
    <div className="delivery-list-container">

      <h2>🚚 Delivery List</h2>

      {deliveries.length === 0 ? (
        <p>No deliveries found.</p>
      ) : (
        <div className="delivery-grid">

          {deliveries.map((delivery) => (

            <div
              className="delivery-card"
              key={delivery.id}
            >

              <h3>Order #{delivery.order}</h3>

              <p>
                <strong>Address:</strong><br />
                {delivery.delivery_address}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {delivery.delivery_status}
              </p>

              <p>
                <strong>Delivery Person:</strong>{" "}
                {delivery.delivery_person || "Not Assigned"}
              </p>

              <div className="delivery-buttons">

                <button
                  onClick={() =>
                    navigate(`/delivery/${delivery.id}`)
                  }
                >
                  View Details
                </button>

                <button
                  onClick={() =>
                    navigate(`/delivery/edit/${delivery.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(delivery.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default DeliveryList;