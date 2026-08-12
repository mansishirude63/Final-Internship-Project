import "../components/SuccessPopUp.css"


function SuccessPopup({ closePopup }) {

  return (

    <div className="success-overlay">

      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h2>
          Thank You! 🎉
        </h2>

        <p>
          Your order has been placed successfully.
        </p>

        <p className="success-message">
          We are preparing your delicious food 🍽️
        </p>

        <button onClick={closePopup}>
          View Order Details
        </button>

      </div>

    </div>

  );

}


export default SuccessPopup;