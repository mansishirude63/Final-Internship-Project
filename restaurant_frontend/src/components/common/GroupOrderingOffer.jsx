
import React from "react";
import { useNavigate } from "react-router-dom";

import "./GroupOrderingOffer.css";

const GroupOrderingOffer = () => {

    const navigate = useNavigate();

    return (

        <section className="group-offer-section">

            <div className="group-offer-container">

                {/* LEFT CONTENT */}

                <div className="group-offer-content">

                    <span className="group-offer-badge">
                        👥 SPECIAL GROUP OFFER
                    </span>


                    <h2>
                        Good Food Is
                        <span> Better Together! 🍽️</span>
                    </h2>


                    <p>
                        Ordering with friends or family?
                        Create a group order, choose your
                        favourite food together and stay
                        within your budget.
                    </p>


                    {/* FEATURES */}

                    <div className="group-offer-features">

                        <div className="group-offer-feature">

                            <div className="group-offer-icon">
                                👥
                            </div>

                            <div>
                                <strong>
                                    Invite Friends
                                </strong>

                                <small>
                                    Order together
                                </small>
                            </div>

                        </div>


                        <div className="group-offer-feature">

                            <div className="group-offer-icon">
                                🍽️
                            </div>

                            <div>
                                <strong>
                                    Choose Together
                                </strong>

                                <small>
                                    Everyone picks food
                                </small>
                            </div>

                        </div>


                        <div className="group-offer-feature">

                            <div className="group-offer-icon">
                                💰
                            </div>

                            <div>
                                <strong>
                                    Set a Budget
                                </strong>

                                <small>
                                    Plan your meal
                                </small>
                            </div>

                        </div>


                        <div className="group-offer-feature">

                            <div className="group-offer-icon">
                                🛒
                            </div>

                            <div>
                                <strong>
                                    One Group Cart
                                </strong>

                                <small>
                                    Everything together
                                </small>
                            </div>

                        </div>

                    </div>


                    {/* BUTTON */}

                    <button
                        className="group-offer-button"
                        onClick={() =>
                            navigate("/group-order")
                        }
                    >
                        Start Group Ordering
                        <span>→</span>
                    </button>

                </div>


                {/* RIGHT VISUAL */}

                <div className="group-offer-visual">

                    <div className="group-offer-circle circle-one">
                        🍕
                    </div>

                    <div className="group-offer-circle circle-two">
                        🍔
                    </div>

                    <div className="group-offer-circle circle-three">
                        🍰
                    </div>

                    <div className="group-offer-main-card">

                        <div className="group-offer-card-top">

                            <span>
                                👥
                            </span>

                            <div>

                                <strong>
                                    Group Meal
                                </strong>

                                <small>
                                    4 members
                                </small>

                            </div>

                            <span className="group-online-dot">
                                ●
                            </span>

                        </div>


                        <div className="group-offer-food-row">

                            <div className="group-food-item">
                                🍕
                            </div>

                            <div className="group-food-item">
                                🍔
                            </div>

                            <div className="group-food-item">
                                🍟
                            </div>

                            <div className="group-food-item">
                                🥤
                            </div>

                        </div>


                        <div className="group-offer-budget">

                            <div>

                                <span>
                                    Group Budget
                                </span>

                                <strong>
                                    ₹800
                                </strong>

                            </div>


                            <div className="budget-status">
                                ✓ Within Budget
                            </div>

                        </div>

                    </div>


                    <div className="group-floating-text">

                        ✨ Everyone chooses

                    </div>

                </div>

            </div>

        </section>

    );

};

export default GroupOrderingOffer;
