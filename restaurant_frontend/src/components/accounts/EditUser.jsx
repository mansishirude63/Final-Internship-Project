import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUser, updateUser } from "../../api/accountApi";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // GET USER
  // -----------------------------------------

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await getUser(id);

      console.log("USER RESPONSE:", response);

      const userData = response.user || response;

      setUser({
        username: userData.username || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        address: userData.address || "",
      });

      setLoading(false);
    } catch (error) {
      console.log("GET USER ERROR:", error);
      alert("Failed to fetch user");
      setLoading(false);
    }
  };

  // -----------------------------------------
  // HANDLE INPUT
  // -----------------------------------------

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------------------
  // UPDATE USER
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateUser(id, {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
      });

      console.log("UPDATE RESPONSE:", response);

      // Update localStorage user information
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const oldUser = JSON.parse(storedUser);

        const updatedUser = {
          ...oldUser,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          address: user.address,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      alert("User information updated successfully!");

      navigate(-1);

    } catch (error) {
      console.log("UPDATE USER ERROR:", error);

      console.log(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Failed to update user information"
      );
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="edit-user-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="edit-user-container">

      <h2>Edit User Information</h2>

      <form onSubmit={handleSubmit}>

        {/* USERNAME */}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
        />

        {/* FIRST NAME */}

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={user.first_name}
          onChange={handleChange}
        />

        {/* LAST NAME */}

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={user.last_name}
          onChange={handleChange}
        />

        {/* EMAIL */}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />

        {/* ADDRESS */}

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={user.address}
          onChange={handleChange}
          rows="4"
        />

        {/* UPDATE BUTTON */}

        <button type="submit">
          Save Changes
        </button>

        {/* CANCEL BUTTON */}

        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>

      </form>

    </div>
  );
}

export default EditUser;