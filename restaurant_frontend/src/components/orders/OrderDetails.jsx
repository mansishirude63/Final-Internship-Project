import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllOrders } from "../../api/ordersApi";
import { useNavigate } from "react-router-dom";

function OrderDetails() {


  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({});

  useEffect(() => {
    fetchOrder();
  }, [id]);


  const fetchOrder = async () => {
    try {
      const response = await getAllOrders();

      const selectedOrder = response.data.orders.find(
        (item) => item.id === Number(id)
      );

      setOrder(selectedOrder);

    } catch (error) {
      console.log(error);
      alert("Failed to fetch order details");
    }
  };


  // if (!order) {
  //   return <h3>Loading order details...</h3>;
  // }


  return (

    <div className="order-details-container">

      <button
        className="backBtn"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <h2>Order Details</h2>

      <div className="order-card">

        {/* <p>
          <strong>Order ID:</strong> {order.id}
        </p>

        <p>
          <strong>User ID:</strong> {order.user}
        </p> */}

        <p>
          <strong>Total Amount:</strong> ₹{order.total_price}
        </p>

        <p>
          <strong>Status:</strong> {order.status}
        </p>

        <p>
          <strong>Delivery Address:</strong> {order.address}
        </p>

        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(order.order_date).toLocaleDateString()}
        </p>


        <h3>Items</h3>

        {order.items?.map((item) => (
          <div key={item.id} className="order-item">

            <p>
              Menu ID: {item.menu}
            </p>

            <p>
              Quantity: {item.quantity}
            </p>

            <p>
              Price: ₹{item.price}
            </p>

          </div>
        ))}


      </div>
    </div>

  );
}

export default OrderDetails;