import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCartItem } from "../../api/cartApi";

function AddCart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    menu: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    setCart({
      ...cart,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addCartItem(cart);
      alert("Item Added to Cart Successfully");
      navigate("/cart");
    } catch (error) {
      console.log(error);
      alert("Failed to Add Item");
    }
  };

  return (
    <div className="add-cart-container">
      <h2>Add to Cart</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="number"
          name="menu"
          placeholder="Menu ID"
          value={cart.menu}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={cart.quantity}
          onChange={handleChange}
          required
        />

        <button type="submit">Add to Cart</button>

      </form>
    </div>
  );
}

export default AddCart;