
import { useEffect, useState } from "react";
import {
  getAllOrders,
  getUserOrders
} from "../../api/ordersApi";

import { getDeliveryByOrderId } from "../../api/deliveryApi";

import { useNavigate } from "react-router-dom";


function OrderList() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);


  useEffect(() => {

    fetchOrders();

    // Refresh every 3 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);

  }, []);


  const fetchOrders = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    console.log("LOGGED IN USER:", user);

    if (!user) {
      return;
    }

    let response;

    if (
      user.status === "Admin" ||
      user.status === "Staff"
    ) {

      response = await getAllOrders();

    } else {

      response = await getUserOrders(user.id);

    }

    console.log("ORDER API RESPONSE:", response.data);

    const orderList =
      response.data.orders || [];

    console.log("ORDERS FROM API:", orderList);

    const updatedOrders =
      await Promise.all(

        orderList.map(async (order) => {

          try {

            const deliveryResponse =
              await getDeliveryByOrderId(order.id);

            const delivery =
              deliveryResponse.data.delivery;

            return {
              ...order,
              status:
                delivery.delivery_status ||
                order.status
            };

          } catch (error) {

            return order;

          }

        })

      );

    console.log("FINAL ORDERS:", updatedOrders);

    setOrders(updatedOrders);

  } catch (error) {

    console.log(
      "Failed to load orders:",
      error
    );

  }
};

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );


  return (

    <div className="order-container">


      {/* Back Button */}

      <button
        className="backBtn"
        onClick={() => navigate(-1)}
      >
        ←
      </button>


      {/* Title */}

      <h2>

        {
          currentUser?.status === "Customer"
            ? "My Orders"
            : "All Orders"
        }

      </h2>


      <table>


        <thead>

          <tr>

            <th>Order ID</th>

            <th>User</th>

            <th>Total</th>

            <th>Status</th>

            <th>Date</th>

            <th>Action</th>

          </tr>

        </thead>


        <tbody>

          {

            orders.length > 0 ? (

              orders.map((order) => (

                <tr key={order.id}>


                  {/* Order ID */}

                  <td>
                    #{order.id}
                  </td>


                  {/* Customer Name */}

                  <td>
                    {order.user_name ||
                      "Unknown"}
                  </td>


                  {/* Total */}

                  <td>
                    ₹{order.total_price}
                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={

                        order.status === "Pending"

                          ? "status-pending"

                          : order.status === "Preparing"

                            ? "status-preparing"

                            : order.status === "Out for Delivery"

                              ? "status-out-for-delivery"

                              : order.status === "Delivered"

                                ? "status-delivered"

                                : "status-pending"

                      }
                    >

                      {order.status}

                    </span>

                  </td>


                  {/* Date */}

                  <td>

                    {
                      order.order_date
                        ? new Date(
                            order.order_date
                          ).toLocaleDateString()
                        : "-"
                    }

                  </td>


                  {/* Details */}

                  <td>

                    <button
                      className="view-order-btn"
                      onClick={() =>
                        navigate(
                          `/order-details/${order.id}`
                        )
                      }
                    >
                      View Details
                    </button>

                  </td>


                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="6">
                  No Orders Found
                </td>

              </tr>

            )

          }

        </tbody>

      </table>


    </div>

  );

}


export default OrderList;

