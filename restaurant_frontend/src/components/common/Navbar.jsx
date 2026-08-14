import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


function Navbar() {


  const [user, setUser] = useState(null);



  useEffect(() => {


    const checkUser = () => {

      const loggedUser = localStorage.getItem("user");


      if (loggedUser) {

        setUser(JSON.parse(loggedUser));

      }

      else {

        setUser(null);

      }

    };



    checkUser();



    // update after login/logout

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


      <div className="logo">

        🍽️ Spice & Spoon 🌶️

      </div>





      <ul className="nav-links">


        <li>
          <Link to="/">
            Home
          </Link>
        </li>



        <li>
          <Link to="/menu">
            Menu
          </Link>
        </li>




        <li>
          <Link to="/cart">
            Cart
          </Link>
        </li>




        <li>
          <Link to="/orders">
            Orders
          </Link>
        </li>





        {
          user ? (

            <>

              <Link
                to={`/accounts/users/${user.id}`}
                className="user-name"
              >
                👤 {user.username}
              </Link>

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


              <li>

                <Link to="/accounts/login">
                  Login
                </Link>

              </li>




              <li>

                <Link to="/accounts/register">
                  Register
                </Link>

              </li>


            </>


          )

        }



      </ul>


    </nav>

  );


}


export default Navbar;