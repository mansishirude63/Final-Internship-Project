import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/accountApi";

function UserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get(`accounts/users/${id}/`);
      setUser(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch user details");
    }
  };

  return (
    <div className="user-details-container">
      <h2>User Details</h2>

      <div className="user-card">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default UserDetails;