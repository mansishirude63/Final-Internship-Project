import React from "react";
import { useNavigate } from "react-router-dom";
import "./Offers.css";

function Offers() {
    const navigate = useNavigate();

    const offers = [
        {
            emoji: "🎉",
            title: "Welcome Offer",
            description: "Get 20% OFF on your first order.",
            code: "WELCOME20",
            discount: 20,
        },
        {
            emoji: "🥦",
            title: "Veg Combo",
            description: "Paneer Tikka + Veg Manchurian + Soft Drink.",
            code: "VEG15",
            discount: 15,
        },

        {
            emoji: "🍕",
            title: "Veg Family Combo",
            description: "2 Veg Starters + 2 Main Courses + 2 Drinks.",
            code: "VEGFAMILY15",
            discount: 15,
        },

        {
            emoji: "🥘",
            title: "Veg Feast",
            description: "Special discount on selected veg dishes.",
            code: "VEGFEAST20",
            discount: 20,
        },

        {
            emoji: "🍗",
            title: "Chicken Thali",
            description: "Get a special discount on Chicken Thali.",
            code: "CHICKENTHALI15",
            discount: 15,
        },

        {
            emoji: "🐐",
            title: "Mutton Thali",
            description: "Enjoy our delicious Mutton Thali with 10% OFF.",
            code: "MUTTONTHALI10",
            discount: 10,
        },

        {
            emoji: "🐟",
            title: "Fish Thali",
            description: "Get 15% OFF on our flavorful Fish Thali.",
            code: "FISHTHALI15",
            discount: 15,
        },

        {
            emoji: "👑",
            title: "Royal Thali",
            description: "Special discount on selected premium thalis.",
            code: "ROYALTHALI20",
            discount: 20,
        },
    ];


    const selectOffer = (offer) => {

        const offerUsed =
            localStorage.getItem("firstOrderOfferUsed");

        if (
            offer.code === "FIRST20" &&
            offerUsed === "true"
        ) {
            alert("This first-order offer has already been used.");
            return;
        }
        const selectedOffer = {
            code: offer.code,
            title: offer.title,
            discount: offer.discount,
        };

        localStorage.setItem(
            "selectedOffer",
            JSON.stringify(selectedOffer)
        );

        navigate("/menu");
    };

    return (
        <div className="offers-page">

            <h1>Special Offers 🎁</h1>

            <p className="offers-subtitle">
                Delicious food, amazing deals!
            </p>

            <div className="offers-container">

                {offers.map((offer, index) => (

                    <div
                        className="offer-card"
                        key={index}
                        onClick={() => selectOffer(offer)}
                    >

                        <div className="offer-emoji">
                            {offer.emoji}
                        </div>

                        <h2>{offer.title}</h2>

                        <p>{offer.description}</p>

                        <div className="offer-discount">
                            {offer.discount}% OFF
                        </div>

                        <div className="offer-coupon">
                            Code: <strong>{offer.code}</strong>
                        </div>

                        <button
                            className="offer-order-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                selectOffer(offer);
                            }}
                        >
                            Order Now 🍽️
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Offers;