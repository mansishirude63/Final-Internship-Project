import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUser } from "../../api/accountApi";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
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

      console.log("USER DETAILS:", response);

      const userData = response.user || response;

      setUser(userData);
      setLoading(false);

    } catch (error) {
      console.log("GET USER ERROR:", error);

      alert("Failed to fetch user details");

      setLoading(false);
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="user-details-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="user-details-container">

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2>User Information</h2>

      <div className="user-card">

        <p>
          <strong>Username:</strong>{" "}
          {user?.username || "Not available"}
        </p>

        <p>
          <strong>First Name:</strong>{" "}
          {user?.first_name || "Not available"}
        </p>

        <p>
          <strong>Last Name:</strong>{" "}
          {user?.last_name || "Not available"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user?.email || "Not available"}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {user?.address || "No address saved"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {user?.status || "Customer"}
        </p>

        <button
          className="change-information-btn"
          onClick={() =>
            navigate(`/accounts/users/${id}/edit`)
          }
        >
          Change Information
        </button>

      </div>

    </div>
  );
}

export default UserDetails;