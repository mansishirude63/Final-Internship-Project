import { useEffect, useState } from "react";

import {
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from "../../api/cartApi";

import { useNavigate } from "react-router-dom";


function CartList() {

  const [cartItems, setCartItems] = useState([]);

  const [selectedOffer, setSelectedOffer] = useState(null);

  const navigate = useNavigate();


  /* ===============================
     FETCH CART
  =============================== */

  useEffect(() => {

    fetchCartItems();

    const savedOffer =
      localStorage.getItem("selectedOffer");

    if (savedOffer) {

      setSelectedOffer(
        JSON.parse(savedOffer)
      );

    }

  }, []);


  const fetchCartItems = async () => {

    try {

      const userId =
        localStorage.getItem("userId");

      const response =
        await getCartItems(userId);

      setCartItems(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load cart items");

    }

  };


  /* ===============================
     INCREASE QUANTITY
  =============================== */

  const increaseQuantity = async (item) => {

    try {

      await updateCartItem(item.id, {
        quantity: item.quantity + 1,
      });

      fetchCartItems();

    } catch (error) {

      console.error(error);

    }

  };


  /* ===============================
     DECREASE QUANTITY
  =============================== */

  const decreaseQuantity = async (item) => {

    if (item.quantity <= 1) return;

    try {

      await updateCartItem(item.id, {
        quantity: item.quantity - 1,
      });

      fetchCartItems();

    } catch (error) {

      console.error(error);

    }

  };


  /* ===============================
     REMOVE ITEM
  =============================== */

  const removeItem = async (id) => {

    try {

      await deleteCartItem(id);

      fetchCartItems();

    } catch (error) {

      console.error(error);

      alert("Failed to remove item");

    }

  };


  /* ===============================
     SUBTOTAL
  =============================== */

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.total_price),
    0
  );


  /* ===============================
     FIND OFFER ITEM
  =============================== */

  const offerItem = selectedOffer?.itemIds?.length
    ? cartItems.find((item) =>
        selectedOffer.itemIds.includes(
          Number(item.menu)
        )
      )
    : null;


  /* ===============================
     CHECK OFFER
  =============================== */

  const offerInvalid =
    selectedOffer &&
    selectedOffer.itemIds?.length > 0 &&
    !offerItem;


  /* ===============================
     DISCOUNT
  =============================== */

  const discount = offerItem
    ? Number(offerItem.total_price) *
      (selectedOffer.discount / 100)
    : 0;


  /* ===============================
     FINAL TOTAL
  =============================== */

  const finalTotal =
    subtotal - discount;


  /* ===============================
     REMOVE OFFER
  =============================== */

  const removeOffer = () => {

    localStorage.removeItem(
      "selectedOffer"
    );

    setSelectedOffer(null);

  };


  /* ===============================
     PLACE ORDER
  =============================== */

  const handlePlaceOrder = () => {

    navigate("/orders/place_order");

  };


  return (

    <div className="cart-container">

      {/* BACK BUTTON */}

      <button
        className="backBtn"
        onClick={() => navigate(-1)}
      >
        ←
      </button>


      <h2>🛒 My Cart</h2>


      {/* ===============================
          CART ITEMS
      =============================== */}

      <div className="cart-grid">

        {cartItems.map((item) => (

          <div
            className="cart-card"
            key={item.id}
          >

            <img
              src={item.menu_image}
              alt={item.menu_name}
              className="cart-image"
            />


            <div className="cart-info">

              <h3>
                {item.menu_name}
              </h3>


              <p>
                Price: ₹{item.menu_price}
              </p>


              {/* QUANTITY */}

              <div className="quantity-box">

                <button
                  onClick={() =>
                    decreaseQuantity(item)
                  }
                >
                  -
                </button>


                <span>
                  {item.quantity}
                </span>


                <button
                  onClick={() =>
                    increaseQuantity(item)
                  }
                >
                  +
                </button>

              </div>


              <h4>
                Total: ₹{item.total_price}
              </h4>


              {/* REMOVE */}

              <button
                className="remove-btn"
                onClick={() =>
                  removeItem(item.id)
                }
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>


      {/* ===============================
          CART TOTAL
      =============================== */}

      <div className="cart-bottom">


        <div className="cart-total">

          {/* SUBTOTAL */}

          <h3>
            Subtotal: ₹{subtotal.toFixed(2)}
          </h3>


          {/* ===============================
              OFFER
          =============================== */}

          {selectedOffer && (

            <div className="cart-offer">

              {offerInvalid ? (

                <>
                  <p>
                    ⚠️ {selectedOffer.title}
                  </p>

                  <p className="discount-text">
                    This offer is not valid for
                    the items in your cart.
                  </p>

                  <button
                    className="remove-offer-btn"
                    onClick={removeOffer}
                  >
                    Remove Offer
                  </button>
                </>

              ) : (

                <>
                  <p>
                    🎁 {selectedOffer.title}
                  </p>

                  <p className="discount-text">

                    {selectedOffer.discount}% OFF

                    {" - ₹"}

                    {discount.toFixed(2)}

                  </p>


                  <button
                    className="remove-offer-btn"
                    onClick={removeOffer}
                  >
                    Remove Offer
                  </button>

                </>

              )}

            </div>

          )}


          {/* DISCOUNT */}

          {!offerInvalid && discount > 0 && (

            <p className="discount-text">

              Discount:
              {" - ₹"}
              {discount.toFixed(2)}

            </p>

          )}


          {/* FINAL TOTAL */}

          <h2>
            Grand Total: ₹{finalTotal.toFixed(2)}
          </h2>

        </div>


        {/* PLACE ORDER */}

        <button
          onClick={handlePlaceOrder}
          className="place-order-btn"
        >
          Place Order
        </button>

      </div>

    </div>

  );

}


export default CartList;