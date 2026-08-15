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

    // Automatically refresh delivery status every 5 seconds
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

  // Loading
  if (loading) {
    return (
      <h2 className="loading">
        Loading delivery details...
      </h2>
    );
  }

  // Delivery not found
  if (!delivery) {
    return (
      <h2 className="loading">
        Delivery not found
      </h2>
    );
  }

  // Current delivery status
  const status = delivery.delivery_status;

  return (
    <div className="delivery-container">

      {/* Page Heading */}
      <h2>
        Track Your Order 🚚
      </h2>


      {/* Delivery Card */}
      <div className="delivery-card">

        {/* Order ID */}
        <p>
          <strong>Order ID:</strong>{" "}
          {delivery.order}
        </p>


        {/* Address */}
        <p>
          <strong>Address:</strong>{" "}
          {delivery.delivery_address}
        </p>


        {/* Delivery Person */}
        <p>
          <strong>Delivery Person:</strong>{" "}
          {delivery.delivery_person_name}
        </p>


        {/* Current Status */}
        <p>
          <strong>Status:</strong>{" "}

          <span className="delivery-status">
            {status}
          </span>
        </p>


        {/* =========================
            ORDER TRACKING
        ========================= */}

        <div className="tracking">

          <h3>
            Order Status
          </h3>


          {/* STEP 1 - PREPARING */}

          <div
            className={`track-step ${
              status === "Preparing"
                ? "active"
                : status === "Out for Delivery" ||
                  status === "Delivered"
                ? "completed"
                : ""
            }`}
          >

            <div className="track-circle">
              1
            </div>

            <p>
              Preparing
            </p>

          </div>


          {/* STEP 2 - OUT FOR DELIVERY */}

          <div
            className={`track-step ${
              status === "Out for Delivery"
                ? "active"
                : status === "Delivered"
                ? "completed"
                : ""
            }`}
          >

            <div className="track-circle">
              2
            </div>

            <p>
              Out for Delivery
            </p>

          </div>


          {/* STEP 3 - DELIVERED */}

          <div
            className={`track-step ${
              status === "Delivered"
                ? "active"
                : ""
            }`}
          >

            <div className="track-circle">
              3
            </div>

            <p>
              Delivered
            </p>

          </div>

        </div>


        {/* =========================
            BUTTONS
        ========================= */}

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