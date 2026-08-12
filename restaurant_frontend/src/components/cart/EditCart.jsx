import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCartItem, updateCartItem } from "../../api/cartApi";

function EditCart() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    menu: "",
    quantity: 1,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCartItem(id);
      setCart({
        menu: response.data.menu,
        quantity: response.data.quantity,
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load cart item");
    }
  };

  const handleChange = (e) => {
    setCart({
      ...cart,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCartItem(id, cart);
      alert("Cart Updated Successfully");
      navigate("/cart");
    } catch (error) {
      console.log(error);
      alert("Failed to update cart");
    }
  };

  return (
    <div className="edit-cart-container">
      <h2>Edit Cart</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="menu"
          value={cart.menu}
          onChange={handleChange}
          placeholder="Menu ID"
          required
        />

        <input
          type="number"
          name="quantity"
          value={cart.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />

        <button type="submit">Update Cart</button>

      </form>
    </div>
  );
}

export default EditCart;