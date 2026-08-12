import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPaymentById, updatePayment } from "../../api/paymentsApi";


function EditPayment() {


  const { id } = useParams();

  const navigate = useNavigate();


  const [payment, setPayment] = useState({

    payment_method: "",

    payment_status: ""

  });



  useEffect(() => {

    fetchPayment();

  }, []);



  const fetchPayment = async () => {

    try {

      const response = await getPaymentById(id);

      setPayment(response.data);


    } catch(error) {

      console.log(error);

    }

  };



  const handleChange = (e) => {

    setPayment({

      ...payment,

      [e.target.name]: e.target.value

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      await updatePayment(id, payment);

      alert("Payment updated");

      navigate("/payments");


    } catch(error) {

      console.log(error);

    }

  };



  return (

    <div className="edit-payment-container">


      <h2>Edit Payment</h2>



      <form onSubmit={handleSubmit}>


        <label>
          Payment Method
        </label>


        <select
          name="payment_method"
          value={payment.payment_method}
          onChange={handleChange}
        >

          <option value="Cash">
            Cash
          </option>

          <option value="UPI">
            UPI
          </option>

          <option value="Card">
            Card
          </option>

        </select>



        <label>
          Payment Status
        </label>


        <select
          name="payment_status"
          value={payment.payment_status}
          onChange={handleChange}
        >

          <option value="Pending">
            Pending
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Failed">
            Failed
          </option>

        </select>



        <button>
          Update Payment
        </button>


      </form>


    </div>

  );

}


export default EditPayment;