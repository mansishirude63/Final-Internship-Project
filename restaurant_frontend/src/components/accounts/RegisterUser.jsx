import { useState } from "react";
import api from "../../api/accountApi";
import { useNavigate } from "react-router-dom";

function RegisterUser({ closePopup }) {
    const navigate = useNavigate();

  const [user, setUser] = useState({

    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",

  });



  const handleChange = (e) => {

    setUser({

      ...user,

      [e.target.name]: e.target.value,

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    if (user.password !== user.confirm_password) {

      alert("Passwords do not match");

      return;

    }



    try {


      const response = await api.post(
        "/accounts/register_user/",
        {

          username: user.username,

          first_name: user.first_name,

          last_name: user.last_name,

          email: user.email,

          password: user.password,

          address: user.address,

        }
      );



      alert("User Registered Successfully");
      navigate("/accounts/login");


      console.log(response.data);



      // Save logged in user

      localStorage.setItem(

        "user",

        JSON.stringify(response.data.user)

      );



      localStorage.setItem(

        "userId",

        response.data.user.id

      );



      // Close popup

      if(closePopup){

        closePopup();

      }



      setUser({

        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        address: "",

      });



    } catch (error) {
    console.log("REGISTER ERROR:", error.response?.data);
    alert(JSON.stringify(error.response?.data));
}
  };



  return (

    <div className="register-page">

    <div className="register-container">

      
      <h2>Register User</h2>



      <form onSubmit={handleSubmit}>



        <input

          type="text"

          name="username"

          placeholder="Username"

          value={user.username}

          onChange={handleChange}

          required

        />



        <input

          type="text"

          name="first_name"

          placeholder="First Name"

          value={user.first_name}

          onChange={handleChange}

          required

        />



        <input

          type="text"

          name="last_name"

          placeholder="Last Name"

          value={user.last_name}

          onChange={handleChange}

          required

        />



        <input

          type="email"

          name="email"

          placeholder="Email"

          value={user.email}

          onChange={handleChange}

          required

        />



        <input

          type="text"

          name="address"

          placeholder="Address"

          value={user.address}

          onChange={handleChange}

          required

        />



        <input

          type="password"

          name="password"

          placeholder="Password"

          value={user.password}

          onChange={handleChange}

          required

        />



        <input

          type="password"

          name="confirm_password"

          placeholder="Confirm Password"

          value={user.confirm_password}

          onChange={handleChange}

          required

        />



        <button type="submit">

          Register

        </button>



      </form>

</div>
    </div>

  );

}


export default RegisterUser;