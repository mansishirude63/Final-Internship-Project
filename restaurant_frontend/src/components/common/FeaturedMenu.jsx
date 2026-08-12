import { useNavigate } from "react-router-dom";
import { addCartItem } from "../../api/cartApi";

function FeaturedMenu() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const foods = [
    {
      id: 1,
      menuId: 1,
      name: "Veg Burger",
      price: "₹149",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      menuId: 2,
      name: "Cheese Pizza",
      price: "₹299",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      menuId: 3,
      name: "French Fries",
      price: "₹99",
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      menuId: 4,
      name: "Cold Coffee",
      price: "₹129",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleAddToCart = async (food) => {
    try {
      await addCartItem({
        user: userId,
        menu: food.menuId,
        quantity: 1,
      });

      alert("Added to cart!");
      navigate("/cart");
    } catch (error) {
      console.log(error);
      alert("Failed to add item.");
    }
  };

  return (
    <section className="featured-menu">
      <div className="featured-header">
        <h2>Featured Menu</h2>

        <button
          className="view-menu-btn"
          onClick={() => navigate("/menu")}
        >
          View All →
        </button>
      </div>

      <div className="menu-container">
        {foods.map((food) => (
          <div className="menu-card" key={food.id}>
            <img src={food.image} alt={food.name} />

            <h3>{food.name}</h3>

            <p>{food.price}</p>

            <button onClick={() => handleAddToCart(food)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedMenu;