import { useState } from "react";
import LoginUser from "../components/accounts/LoginUser";
import RegisterUser from "../components/accounts/RegisterUser";
import "./PopUp.css";


function AuthPopup({ closePopup }) {

    const [showLogin, setShowLogin] = useState(true);


    return (

        <div className="popup-overlay">

            <div className="popup-box">

                <button 
                    className="close-btn"
                    onClick={closePopup}
                >
                    ✖
                </button>


                {
                    showLogin ?

                    <LoginUser closePopup={closePopup}/>

                    :

                    <RegisterUser closePopup={closePopup}/>

                }



                <p>

                {
                    showLogin
                    ?
                    "Don't have an account?"
                    :
                    "Already have an account?"
                }


                <button
                    className="switch-btn"
                    onClick={() => setShowLogin(!showLogin)}
                >

                {
                    showLogin
                    ?
                    " Register"
                    :
                    " Login"
                }

                </button>

                </p>


            </div>

        </div>

    )

}


export default AuthPopup;