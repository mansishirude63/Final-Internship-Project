import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/accountApi";


function LoginUser({ closePopup }) {


  const navigate = useNavigate();



  const [loginData, setLoginData] = useState({

    username: "",

    password: "",

  });




  const handleChange = (e) => {

    setLoginData({

      ...loginData,

      [e.target.name]: e.target.value,

    });

  };





  const handleSubmit = async (e) => {

    e.preventDefault();



    try {


      const response = await api.post(

        "/accounts/login_user/",

        loginData

      );



      const loggedInUser = response.data.user;




      // Save user details

      localStorage.setItem(

        "user",

        JSON.stringify(loggedInUser)

      );



      localStorage.setItem(

        "userId",

        loggedInUser.id

      );





      // Update Navbar without refresh

      window.dispatchEvent(
        new Event("storage")
      );





      alert("Login Successful");





      // Close popup

      if(closePopup){

        closePopup();

      }





      // Role based navigation

      if(loggedInUser.status === "Admin"){


        navigate("accounts/users");


      }

      else if(loggedInUser.status === "Staff"){


        navigate("/orders");


      }

      else{


        navigate("/");


      }



    }


    catch(error){


      console.log(

        error.response?.data

      );


      alert("Invalid Username or Password");


    }



  };







 return (
  
  closePopup ? (

    <div className="login-container">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={loginData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  ) : (

    <div className="login-page">

      <div className="login-container">

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={loginData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>

  )
);

}


export default LoginUser;