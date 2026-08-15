import { useEffect, useState } from "react";

import {
  getAllOrders,
  getUserOrders,
  updateOrder
} from "../../api/ordersApi";

import { getDeliveryByOrderId } from "../../api/deliveryApi";

import { useNavigate } from "react-router-dom";


function OrderList() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);


  // =========================
  // FETCH ORDERS
  // =========================

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

      console.log(
        "LOGGED IN USER:",
        user
      );


      if (!user) {
        return;
      }


      let response;


      // Admin / Staff see all orders
      if (
        user.status === "Admin" ||
        user.status === "Staff"
      ) {

        response = await getAllOrders();

      }

      // Customer sees only their orders
      else {

        response = await getUserOrders(
          user.id
        );

      }


      console.log(
        "ORDER API RESPONSE:",
        response.data
      );


      const orderList =
        response.data.orders || [];


      // Get delivery status
      const updatedOrders =
        await Promise.all(

          orderList.map(
            async (order) => {

              try {

                const deliveryResponse =
                  await getDeliveryByOrderId(
                    order.id
                  );


                const delivery =
                  deliveryResponse.data.delivery;


                return {

                  ...order,

                  status:
                    delivery.delivery_status ||
                    order.status

                };

              }

              catch (error) {

                return order;

              }

            }
          )

        );


      console.log(
        "FINAL ORDERS:",
        updatedOrders
      );


      setOrders(
        updatedOrders
      );


    }

    catch (error) {

      console.log(
        "Failed to load orders:",
        error
      );

    }

  };


  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (orderId) => {

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );


    if (!confirmCancel) {
      return;
    }


    try {

      await updateOrder(
        orderId,
        {
          status: "Cancelled"
        }
      );


      alert(
        "❌ Order cancelled successfully."
      );


      // Refresh orders
      await fetchOrders();


    }

    catch (error) {

      console.log(
        "Cancel order error:",
        error
      );


      alert(
        "Failed to cancel order."
      );

    }

  };


  // =========================
  // CURRENT USER
  // =========================

  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );


  return (

    <div className="order-container">


      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        className="backBtn"
        onClick={() =>
          navigate(-1)
        }
      >
        ←
      </button>


      {/* =========================
          TITLE
      ========================= */}

      <h2>

        {
          currentUser?.status ===
          "Customer"

            ? "My Orders"

            : "All Orders"

        }

      </h2>


      {/* =========================
          ORDER TABLE
      ========================= */}

      <table>

        <thead>

          <tr>

            <th>
              Order ID
            </th>

            <th>
              User
            </th>

            <th>
              Total
            </th>

            <th>
              Status
            </th>

            <th>
              Date
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>


        <tbody>

          {

            orders.length > 0 ? (

              orders.map(
                (order) => (

                  <tr
                    key={order.id}
                  >


                    {/* =====================
                        ORDER ID
                    ===================== */}

                    <td>
                      #{order.id}
                    </td>


                    {/* =====================
                        CUSTOMER
                    ===================== */}

                    <td>
                      {
                        order.user_name ||
                        "Unknown"
                      }
                    </td>


                    {/* =====================
                        TOTAL
                    ===================== */}

                    <td>
                      ₹{order.total_price}
                    </td>


                    {/* =====================
                        STATUS
                    ===================== */}

                    <td>

                      {

                        order.status ===
                        "Cancelled"

                          ? (

                            <span className="status-cancelled">

                              Order Cancelled

                            </span>

                          )

                          : (

                            <span

                              className={

                                order.status ===
                                "Pending"

                                  ? "status-pending"

                                  : order.status ===
                                    "Preparing"

                                    ? "status-preparing"

                                    : order.status ===
                                      "Out for Delivery"

                                      ? "status-out-for-delivery"

                                      : order.status ===
                                        "Delivered"

                                        ? "status-delivered"

                                        : "status-pending"

                              }

                            >

                              {order.status}

                            </span>

                          )

                      }

                    </td>


                    {/* =====================
                        DATE
                    ===================== */}

                    <td>

                      {

                        order.order_date

                          ? new Date(
                              order.order_date
                            ).toLocaleDateString()

                          : "-"

                      }

                    </td>


                    {/* =====================
                        ACTIONS
                    ===================== */}

                    <td>

                      <div className="order-actions">


                        {/* VIEW DETAILS */}

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


                        {/* CANCEL ORDER */}

                        {

                          currentUser?.status ===
                            "Customer" &&

                          order.status !==
                            "Delivered" &&

                          order.status !==
                            "Cancelled" && (

                            <button

                              className="cancel-order-btn"

                              onClick={() =>
                                cancelOrder(
                                  order.id
                                )
                              }

                            >

                              ❌ Cancel Order

                            </button>

                          )

                        }


                        {/* CANCELLED MESSAGE */}

                        {

                          order.status ===
                            "Cancelled" && (

                            <span className="cancelled-text">

                              Order Cancelled

                            </span>

                          )

                        }


                      </div>

                    </td>


                  </tr>

                )

              )

            )

            : (

              <tr>

                <td
                  colSpan="6"
                  className="no-orders"
                >

                  📦 No Orders Found

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