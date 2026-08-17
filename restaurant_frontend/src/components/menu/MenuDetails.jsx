import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMenu } from "../../api/menuApi";
import { addCartItem } from "../../api/cartApi";
import { useNavigate } from "react-router-dom";

function MenuDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [menu, setMenu] = useState({});

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await getMenu(id);
      setMenu(response.data.menu);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch menu details");
    }
  };

  const handleAddToCart = async () => {
    try {
      // Call your Add to Cart API here
      // await addCartItem(menu.id, 1);

      alert("Item added to cart!");

      navigate("/cart");
    } catch (error) {
      console.log(error);
      alert("Failed to add item to cart.");
    }
  };
  return (
    <div className="menu-details-container">

      <button
        className="backBtn"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <h1>Menu Details</h1>

      <div className="menu-details-card">
        <h2>{menu.name}</h2>
        <img
          src={`http://127.0.0.1:8000${menu.image}`}
          alt={menu.name}
          className="details-image"
        />
        <p>
          <strong>Description:</strong> {menu.description}
        </p>

        <p>
          <strong>Category:</strong> {menu.category}
        </p>

        <p>
          <strong>Price:</strong> ₹{menu.price}
        </p>

        <p>
          <strong>Available:</strong>{" "}
          {menu.is_available ? "Yes" : "No"}
        </p>
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default MenuDetails;