import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaymentById } from "../../api/paymentsApi";
import { useNavigate } from "react-router-dom";


function PaymentDetails() {

  const navigate = useNavigate();

  const { id } = useParams();


  const [payment, setPayment] = useState(null);



  useEffect(() => {

    fetchPayment();

  }, []);



  const fetchPayment = async () => {
    try {
      const response = await getPaymentById(id);
      setPayment(response.data);

    } catch (error) {

      console.log(error.response?.data);

      alert("Payment not found");

    }
  };



  if (!payment) {

    return <h2>Loading...</h2>;

  }



  return (

    <div className="payment-details-container">


      <h2>
        Payment Details
      </h2>



      <div className="payment-details-card">


        <h3>
          Payment ID: {payment.id}
        </h3>


        <p>
          Order ID: {payment.order}
        </p>


        <p>
          Amount: ₹{payment.amount}
        </p>


        <p>
          Payment Method: {payment.payment_method}
        </p>


        <p>
          Payment Status: {payment.payment_status}
        </p>


        <p>
          <strong>Transaction ID:</strong> {payment.payment_id}
        </p>


        <p>
          Date: {payment.payment_date}
        </p>



      </div>

      <button
        className="track-order-btn"
        onClick={() => navigate(`/delivery/${payment.order}`)}
      >
        🚚 Track Order
      </button>
      
    </div>



  );

}


export default PaymentDetails;