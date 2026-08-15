import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const checkUser = () => {

      const loggedUser = localStorage.getItem("user");

      if (loggedUser) {
        setUser(JSON.parse(loggedUser));
      } else {
        setUser(null);
      }

    };

    checkUser();

    // Update after login/logout
    window.addEventListener(
      "storage",
      checkUser
    );

    return () => {

      window.removeEventListener(
        "storage",
        checkUser
      );

    };

  }, []);


  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    setUser(null);

    window.location.href = "/";

  };


  return (

    <nav className="navbar">

      {/* Logo */}

      <div className="logo">
        🍽️ Spice & Spoon 🌶️
      </div>


      {/* Navigation */}

      <ul className="nav-links">

        {/* Home */}

        <li>
          <Link to="/">
            Home
          </Link>
        </li>


        {/* Menu */}

        <li>
          <Link to="/menu">
            Menu
          </Link>
        </li>


        {/* Offers */}

        <li>
          <Link
            to="/offers"
            className="offers-link"
          >
            🎁 Offers
          </Link>
        </li>


        {/* Cart */}

        <li>
          <Link to="/cart">
            Cart
          </Link>
        </li>


        {/* Orders */}

        <li>
          <Link to="/orders">
            Orders
          </Link>
        </li>


        {/* User Logged In */}

        {user ? (

          <>

            <li>
              <Link
                to={`/accounts/users/${user.id}`}
                className="user-name"
              >
                👤 {user.username}
              </Link>
            </li>


            <li>
              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>

          </>

        ) : (

          <>

            {/* Login */}

            <li>
              <Link to="/accounts/login">
                Login
              </Link>
            </li>


            {/* Register */}

            <li>
              <Link to="/accounts/register">
                Register
              </Link>
            </li>

          </>

        )}

      </ul>

    </nav>

  );

}

export default Navbar;