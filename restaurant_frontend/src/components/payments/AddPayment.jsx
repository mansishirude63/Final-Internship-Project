
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { addPayment } from "../../api/paymentsApi";
import { getOrderById } from "../../api/ordersApi";

import SuccessPopUp from "../SuccessPopUp";


function AddPayment() {

    const { orderId } = useParams();

    const navigate = useNavigate();


    const [paymentData, setPaymentData] = useState({

        order: orderId,

        amount: "",

        payment_method: "Cash"

    });


    const [showSuccess, setShowSuccess] =
        useState(false);


    const [loading, setLoading] =
        useState(true);


    // Fetch order amount
    useEffect(() => {

        fetchOrder();

    }, [orderId]);


    const fetchOrder = async () => {

        try {

            setLoading(true);

            const response =
                await getOrderById(orderId);


            console.log(
                "ORDER RESPONSE:",
                response.data
            );


            setPaymentData({

                order: orderId,

                amount:
                    response.data.order.total_price,

                payment_method: "Cash"

            });


        } catch (error) {

            console.log(
                "ORDER FETCH ERROR:",
                error
            );

            alert(
                "Failed to fetch order"
            );

        } finally {

            setLoading(false);

        }

    };


    // Payment method change
    const handleChange = (e) => {

        setPaymentData({

            ...paymentData,

            [e.target.name]:
                e.target.value

        });

    };


    // Handle payment
    const handlePayment = async (e) => {

        e.preventDefault();


        if (!paymentData.amount) {

            alert(
                "Payment amount is not available."
            );

            return;

        }


        try {

            const payment = {

                order:
                    paymentData.order,

                amount:
                    paymentData.amount,

                payment_method:
                    paymentData.payment_method,

                payment_status:

                    paymentData.payment_method === "Cash"

                        ? "Pending"

                        : "Completed"

            };


            console.log(
                "PAYMENT DATA:",
                payment
            );


            const response =
                await addPayment(payment);


            console.log(
                "Payment Created:",
                response.data
            );


            // Show success popup
            setShowSuccess(true);


        } catch (error) {

            console.log(
                "PAYMENT ERROR:",
                error
            );

            console.log(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            alert(

                error.response?.data?.message ||

                error.response?.data?.error ||

                JSON.stringify(
                    error.response?.data
                ) ||

                "Payment failed"

            );

        }

    };


    // Loading
    if (loading) {

        return (

            <div className="payment-container">

                <h2>
                    Loading Payment...
                </h2>

            </div>

        );

    }


    return (

        <div className="payment-container">


            <h2>
                Payment
            </h2>


            <form
                onSubmit={handlePayment}
            >


                {/* AMOUNT */}

                <label>
                    Amount
                </label>


                <input

                    type="number"

                    value={
                        paymentData.amount
                    }

                    readOnly

                />



                {/* PAYMENT METHOD */}

                <label>
                    Payment Method
                </label>


                <select

                    name="payment_method"

                    value={
                        paymentData.payment_method
                    }

                    onChange={
                        handleChange
                    }

                >

                    <option value="Cash">
                        Cash on Delivery
                    </option>


                    <option value="UPI">
                        UPI
                    </option>


                    <option value="Card">
                        Card
                    </option>

                </select>



                {/* PAYMENT BUTTON */}

                <button
                    type="submit"
                >

                    {

                        paymentData.payment_method ===
                        "Cash"

                            ? "Place Order"

                            : "Pay Now"

                    }

                </button>


            </form>



            {/* SUCCESS POPUP */}

            {

                showSuccess &&

                <SuccessPopUp

                    closePopup={() => {

                        setShowSuccess(false);


                        // Go to existing delivery page
                        navigate(
                            `/delivery/${orderId}`
                        );

                    }}

                />

            }


        </div>

    );

}


export default AddPayment;
