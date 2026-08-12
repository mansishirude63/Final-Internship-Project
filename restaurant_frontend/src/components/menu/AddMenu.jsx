import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMenu } from "../../api/menuApi";

function AddMenu() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    is_available: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setMenu({
      ...menu,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addMenu(menu);
      alert("Menu Added Successfully");

      setMenu({
        name: "",
        description: "",
        category: "",
        price: "",
        is_available: true,
      });

      navigate("/menu");
    } catch (error) {
      console.log(error);
      alert("Failed to Add Menu");
    }
  };

  return (
    <div className="add-menu-container">
      <h2>Add Menu Item</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={menu.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={menu.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={menu.category}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={menu.price}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="is_available"
            checked={menu.is_available}
            onChange={handleChange}
          />
          Available
        </label>

        <button type="submit">Add Menu</button>

      </form>
    </div>
  );
}

export default AddMenu;