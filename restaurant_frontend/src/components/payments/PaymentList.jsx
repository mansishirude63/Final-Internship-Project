import { useEffect, useState } from "react";
import { getPayments } from "../../api/paymentsApi";
import { useNavigate } from "react-router-dom";


function PaymentList() {

  const [payments, setPayments] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {

    fetchPayments();

  }, []);



  const fetchPayments = async () => {

    try {

      const response = await getPayments();

      setPayments(response.data);


    } catch(error) {

      console.log(error);

      alert("Failed to fetch payments");

    }

  };



  return (

    <div className="payment-list-container">


      <h2>Payment History</h2>


      <div className="payment-grid">


        {payments.length === 0 ? (

          <h3>No Payments Found</h3>

        ) : (

          payments.map((payment) => (


            <div
              className="payment-card"
              key={payment.id}
            >


              <h3>
                Payment #{payment.id}
              </h3>


              <p>
                Order ID: {payment.order}
              </p>


              <p>
                Amount: ₹{payment.amount}
              </p>


              <p>
                Method: {payment.payment_method}
              </p>


              <p>
                Status: {payment.payment_status}
              </p>



              <button
                onClick={() =>
                  navigate(`/payments/${payment.id}`)
                }
              >
                View Details
              </button>


            </div>


          ))

        )}


      </div>


    </div>

  );

}


export default PaymentList;