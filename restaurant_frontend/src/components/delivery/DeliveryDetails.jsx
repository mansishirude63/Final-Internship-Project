import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDeliveryByOrderId } from "../../api/deliveryApi";

function DeliveryDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDelivery();

    const interval = setInterval(() => {
      fetchDelivery();
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  const fetchDelivery = async () => {
    try {
      const response = await getDeliveryByOrderId(orderId);
      setDelivery(response.data.delivery);
    } catch (error) {
      console.log(error);
      alert("Failed to load delivery details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="loading">Loading delivery details...</h2>;
  }

  if (!delivery) {
    return <h2 className="loading">Delivery not found</h2>;
  }

  return (
    <div className="delivery-container">
      <h2>Track Your Order 🚚</h2>

      <div className="delivery-card">
        <p>
          <strong>Order ID:</strong> {delivery.order}
        </p>

        <p>
          <strong>Address:</strong> {delivery.delivery_address}
        </p>
        <p>
          <strong>Delivery Person:</strong>{" "}
          {delivery.delivery_person_name}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span className="delivery-status">
            {delivery.delivery_status}
          </span>
        </p>

        <div className="tracking">
          <h3>Order Status</h3>

          {/* Step 1 */}
          <div
            className={`track-step ${delivery.delivery_status === "Preparing"
                ? "active"
                : delivery.delivery_status === "Out for Delivery" ||
                  delivery.delivery_status === "Delivered"
                  ? "completed"
                  : ""
              }`}
          >
            <div className="track-circle">1</div>
            <p>Preparing</p>
          </div>

          {/* Step 2 */}
          <div
            className={`track-step ${delivery.delivery_status === "Out for Delivery"
                ? "active"
                : delivery.delivery_status === "Delivered"
                  ? "completed"
                  : ""
              }`}
          >
            <div className="track-circle">2</div>
            <p>Out for Delivery</p>
          </div>

          {/* Step 3 */}
          <div
            className={`track-step ${delivery.delivery_status === "Delivered"
                ? "active"
                : ""
              }`}
          >
            <div className="track-circle">3</div>
            <p>Delivered</p>
          </div>
        </div>

        <div className="delivery-buttons">
          <button
            className="orders-btn"
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>

          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            Back To Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryDetails;