import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMenu, updateMenu } from "../../api/menuApi";

function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    is_available: true,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await getMenu(id);
      setMenu(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load menu item");
    }
  };

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
      await updateMenu(id, menu);
      alert("Menu Updated Successfully");
      navigate("/menu");
    } catch (error) {
      console.log(error);
      alert("Failed to update menu");
    }
  };

  return (
    <div className="edit-menu-container">
      <h2>Edit Menu Item</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          value={menu.name}
          onChange={handleChange}
          placeholder="Food Name"
          required
        />

        <textarea
          name="description"
          value={menu.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          type="text"
          name="category"
          value={menu.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />

        <input
          type="number"
          name="price"
          value={menu.price}
          onChange={handleChange}
          placeholder="Price"
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

        <button type="submit">Update Menu</button>

      </form>
    </div>
  );
}

export default EditMenu;