import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getGroupOrder,
    getGroupCart,
    removeGroupCartItem,
} from "../../api/groupOrderApi";

import "./GroupCart.css";

function GroupCart() {

    const { groupCode } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [groupCart, setGroupCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const userId = localStorage.getItem("userId");


    useEffect(() => {

        if (!userId) {
            navigate("/login");
            return;
        }

        loadGroupCart();

    }, [groupCode]);


    const loadGroupCart = async () => {

        try {

            setLoading(true);

            const [groupResponse, cartResponse] =
                await Promise.all([
                    getGroupOrder(groupCode),
                    getGroupCart(groupCode)
                ]);

            setGroup(groupResponse);

            setGroupCart(
                cartResponse.items || []
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Failed to load group cart."
            );

        } finally {

            setLoading(false);

        }

    };


    const removeFromCart = async (itemId) => {

        try {

            await removeGroupCartItem(itemId);

            setGroupCart(
                groupCart.filter(
                    item => item.id !== itemId
                )
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Failed to remove item."
            );

        }

    };


    const calculateTotal = () => {

        return groupCart.reduce(
            (total, item) =>
                total + Number(item.total_price),
            0
        );

    };


    const isMyItem = (item) => {

        return String(item.user) ===
            String(userId);

    };


    // PLACE GROUP ORDER
    // Go to the EXISTING AddOrder / Place Order page
    const handlePlaceOrder = () => {

        if (groupCart.length === 0) {
            alert("Group cart is empty.");
            return;
        }

        try {

            setPlacingOrder(true);

            console.log(
                "Sending group cart to existing Place Order page..."
            );

            navigate("/orders/place_order", {
                state: {
                    groupCart: groupCart,
                    groupCode: groupCode,
                    groupTotal: calculateTotal()
                }
            });

        } catch (error) {

            console.log(
                "GROUP ORDER NAVIGATION ERROR:",
                error
            );

            alert(
                "Unable to continue to place order."
            );

        } finally {

            setPlacingOrder(false);

        }

    };


    if (loading) {

        return (

            <div className="group-cart-loading">

                Loading group cart...

            </div>

        );

    }


    if (!group) {

        return (

            <div className="group-cart-error">

                <h2>
                    Group not found
                </h2>


                <button
                    onClick={() =>
                        navigate("/group-order")
                    }
                >
                    Go Back
                </button>

            </div>

        );

    }


    return (

        <div className="group-cart-page">


            {/* HEADER */}

            <div className="group-cart-header">

                <button
                    className="group-cart-back-button"
                    onClick={() =>
                        navigate(
                            `/group-order/${groupCode}`
                        )
                    }
                >
                    ← Back to Group
                </button>


                <h1>
                    🛒 Group Cart
                </h1>


                <p>
                    Everyone's selected food
                </p>

            </div>



            {/* GROUP INFORMATION */}

            <div className="group-cart-info">

                <div>

                    <span>
                        Group Code
                    </span>

                    <strong>
                        {group.group_code}
                    </strong>

                </div>


                <div>

                    <span>
                        Members
                    </span>

                    <strong>
                        {group.members?.length || 0}
                    </strong>

                </div>

            </div>



            {/* CART */}

            <div className="group-cart-card">

                {groupCart.length === 0 ? (

                    <div className="empty-group-cart">

                        <div>
                            🛒
                        </div>


                        <h2>
                            Group cart is empty
                        </h2>


                        <p>
                            Add some delicious food!
                        </p>


                        <button
                            onClick={() =>
                                navigate(
                                    `/group-order/${groupCode}`
                                )
                            }
                        >
                            Browse Menu
                        </button>

                    </div>

                ) : (

                    <div className="group-cart-items">

                        {groupCart.map(item => (

                            <div
                                className="group-cart-item"
                                key={item.id}
                            >


                                {item.menu_image && (

                                    <img
                                        src={
                                            `https://final-internship-project-kcp1.onrender.com${item.menu_image}`
                                        }
                                        alt={item.menu_name}
                                        className="group-cart-item-image"
                                    />

                                )}


                                <div className="group-cart-item-info">

                                    <h3>
                                        {item.menu_name}
                                    </h3>


                                    <p>
                                        Added by:{" "}
                                        <strong>
                                            {item.username}
                                        </strong>
                                    </p>


                                    <p>
                                        ₹{item.menu_price} ×{" "}
                                        {item.quantity}
                                    </p>

                                </div>


                                <div className="group-cart-item-right">

                                    <strong>
                                        ₹{item.total_price}
                                    </strong>


                                    {isMyItem(item) && (

                                        <button
                                            className="remove-group-item"
                                            onClick={() =>
                                                removeFromCart(
                                                    item.id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>


                            </div>

                        ))}

                    </div>

                )}

            </div>



            {/* TOTAL + BUTTON */}

            {groupCart.length > 0 && (

                <div className="group-cart-total">

                    <div className="group-total-row">

                        <span>
                            Group Total
                        </span>


                        <strong>
                            ₹{calculateTotal().toFixed(2)}
                        </strong>

                    </div>


                    <div className="group-cart-actions">

                        <button
                            className="add-more-food-button"
                            onClick={() =>
                                navigate(
                                    `/group-order/${groupCode}`
                                )
                            }
                        >
                            + Add More Food
                        </button>


                        <button
                            className="place-group-order-button"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                        >

                            {placingOrder
                                ? "Opening Order..."
                                : "🛒 Place Group Order"
                            }

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}

export default GroupCart;