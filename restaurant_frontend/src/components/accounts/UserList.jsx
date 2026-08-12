import { useEffect, useState } from "react";
import api from "../../api/accountApi";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    const response = await api.get("accounts/get_all_Users/");
    console.log(response.data);
    setUsers(response.data);
  } catch (error) {
    console.log(error);
    alert("Failed to load users");
  }
};

  return (
    <div className="user-list-container">
      <h2>All Users</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;