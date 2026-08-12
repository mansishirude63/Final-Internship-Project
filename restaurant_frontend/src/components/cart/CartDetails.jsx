import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCartItem } from "../../api/cartApi";

function CartDetails() {
  const { id } = useParams();

  const [cart, setCart] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCartItem(id);
      setCart(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch cart details");
    }
  };

  return (
    <div className="cart-details-container">
      <h2>Cart Details</h2>

      <div className="cart-card">
        <p><strong>Cart ID:</strong> {cart.id}</p>
        <p><strong>Menu Item:</strong> {cart.menu_name}</p>
        <p><strong>Quantity:</strong> {cart.quantity}</p>
        <p><strong>Price:</strong> ₹{cart.price}</p>
        <p><strong>Total:</strong> ₹{cart.total_price}</p>
      </div>
    </div>
  );
}

export default CartDetails;