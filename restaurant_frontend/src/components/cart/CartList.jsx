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

  useEffect(() => {
    fetchCartItems();

    const savedOffer = localStorage.getItem("selectedOffer");

    if (savedOffer) {
      setSelectedOffer(JSON.parse(savedOffer));
    }
  }, []);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await getCartItems(userId);

      setCartItems(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load cart items");
    }
  };

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
    (total, item) => total + Number(item.total_price),
    0
  );

  /* ===============================
     OFFER ITEM IDS
  =============================== */

  const offerItemIds = {
    VEG15: [2, 5, 42],
    VEGFAMILY15: [1, 2, 11, 13, 35, 37],
    VEGFEAST20: [11, 15, 24],
    CHICKENTHALI15: [62],
    MUTTONTHALI10: [63],
    FISHTHALI15: [64],
    ROYALTHALI20: [65],
  };

  /* ===============================
     CALCULATE DISCOUNT
  =============================== */

  let discount = 0;
  let offerInvalid = false;

  if (selectedOffer) {
    const code = selectedOffer.code;

    // WELCOME20 → discount on complete cart
    if (code === "WELCOME20") {
      discount = subtotal * (selectedOffer.discount / 100);
    }

    // Other offers → discount only on offer items
    else if (offerItemIds[code]) {
      const matchingItems = cartItems.filter((item) =>
        offerItemIds[code].includes(Number(item.menu))
      );

      if (matchingItems.length === 0) {
        offerInvalid = true;
      } else {
        const offerSubtotal = matchingItems.reduce(
          (total, item) => total + Number(item.total_price),
          0
        );

        discount =
          offerSubtotal * (selectedOffer.discount / 100);
      }
    }
  }

  /* ===============================
     FINAL TOTAL
  =============================== */

  const finalTotal = Math.max(0, subtotal - discount);

  /* ===============================
     REMOVE OFFER
  =============================== */

  const removeOffer = () => {
    localStorage.removeItem("selectedOffer");
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

      <button
        className="backBtn"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <h2>🛒 My Cart</h2>

      {/* CART ITEMS */}

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

              <h3>{item.menu_name}</h3>

              <p>
                Price: ₹{item.menu_price}
              </p>

              <div className="quantity-box">

                <button
                  onClick={() =>
                    decreaseQuantity(item)
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

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

      {/* CART TOTAL */}

      <div className="cart-bottom">

        <div className="cart-total">

          <h3>
            Subtotal: ₹{subtotal.toFixed(2)}
          </h3>

          {/* OFFER */}

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
              Discount: - ₹{discount.toFixed(2)}
            </p>
          )}

          {/* GRAND TOTAL */}

          <h2>
            Grand Total: ₹{finalTotal.toFixed(2)}
          </h2>

        </div>

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