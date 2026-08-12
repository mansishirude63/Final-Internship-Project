import { useEffect, useState } from "react";
import { getCartItems, updateCartItem, deleteCartItem, } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../api/ordersApi";

function CartList() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
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
  const grandTotal = cartItems.reduce(
    (total, item) => total + Number(item.total_price),
    0
  );

  const handlePlaceOrder = () => {
    console.log("clicked");
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

      <div className="cart-grid">
        {cartItems.map((item) => (
          <div className="cart-card" key={item.id}>
            <img
              src={item.menu_image}
              alt={item.menu_name}
              className="cart-image"
            />

            <div className="cart-info">
              <h3>{item.menu_name}</h3>

              <p>Price: ₹{item.menu_price}</p>

              <div className="quantity-box">
                <button onClick={() => decreaseQuantity(item)}>-</button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQuantity(item)}>+</button>
              </div>

              <h4>Total: ₹{item.total_price}</h4>


              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Grand Total: ₹{grandTotal}</h2>
        </div>

        <button onClick={handlePlaceOrder} className="place-order-btn">
          Place Order
        </button>
      </div>
    


    </div>
  );
}

export default CartList;