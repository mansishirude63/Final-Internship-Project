import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getCartItems } from "../../api/cartApi";
import { placeOrder } from "../../api/ordersApi";
import { getUser, updateUser } from "../../api/accountApi";


function AddOrder() {

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [hasAddress, setHasAddress] = useState(false);

    const [selectedOffer, setSelectedOffer] = useState(null);


    // ==========================================
    // GROUP ORDER DATA
    // ==========================================

    const groupCart =
        location.state?.groupCart || null;

    const groupCode =
        location.state?.groupCode || null;

    const isGroupOrder =
        Array.isArray(groupCart) &&
        groupCart.length > 0;


    // ==========================================
    // ADDRESS DATA
    // ==========================================

    const [addressData, setAddressData] = useState({

        full_name: "",
        phone_number: "",
        house_no: "",
        street: "",
        city: "",
        state: "",
        pincode: "",

    });


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchCart();
        fetchUserAddress();

        const savedOffer =
            localStorage.getItem("selectedOffer");

        if (savedOffer) {

            try {

                setSelectedOffer(
                    JSON.parse(savedOffer)
                );

            } catch (error) {

                console.log(
                    "OFFER ERROR:",
                    error
                );

                localStorage.removeItem(
                    "selectedOffer"
                );

            }

        }

    }, []);


    // ==========================================
    // FETCH CART
    // ==========================================

    const fetchCart = async () => {

        try {

            // GROUP ORDER
            if (isGroupOrder) {

                console.log(
                    "GROUP CART RECEIVED:",
                    groupCart
                );

                console.log(
                    "GROUP CODE:",
                    groupCode
                );

                setCartItems(groupCart);

                return;
            }


            // NORMAL ORDER

            const userId =
                localStorage.getItem("userId");


            const response =
                await getCartItems(userId);


            setCartItems(
                response.data
            );


        } catch (error) {

            console.log(
                "CART ERROR:",
                error
            );

            alert(
                "Failed to load cart"
            );

        }

    };


    // ==========================================
    // FETCH USER ADDRESS
    // ==========================================

    const fetchUserAddress = async () => {

        try {

            const userId =
                localStorage.getItem("userId");


            const response =
                await getUser(userId);


            console.log(
                "USER RESPONSE:",
                response
            );


            const userData =
                response.user;


            setUser(userData);


            if (
                userData.address &&
                userData.address.trim() !== ""
            ) {

                setHasAddress(true);


                setAddressData({

                    full_name:
                        userData.address,

                    phone_number: "",
                    house_no: "",
                    street: "",
                    city: "",
                    state: "",
                    pincode: "",

                });

            } else {

                setHasAddress(false);

            }


        } catch (error) {

            console.log(
                "USER ADDRESS ERROR:",
                error
            );

        }

    };


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        setAddressData({

            ...addressData,

            [e.target.name]:
                e.target.value,

        });

    };


    // ==========================================
    // ORIGINAL TOTAL
    // ==========================================

    const subtotal = cartItems.reduce(

        (sum, item) => {

            return (
                sum +
                Number(
                    item.total_price || 0
                )
            );

        },

        0

    );


    // ==========================================
    // OFFER ITEM IDS
    // ==========================================
    //
    // These IDs match your Menu database.
    //
    // Fish Thali = 64
    // Chicken Thali = 62
    // Mutton Thali = 63
    //


    const offerRules = {

        WELCOME20: {
            itemIds: null,
            discount: 20
        },

        VEG15: {
            itemIds: [2, 5],
            discount: 15
        },

        VEGFAMILY15: {
            itemIds: [
                1, 2, 3, 4, 5,
                11, 12, 13, 14,
                15, 16, 17, 18, 19, 20
            ],
            discount: 15
        },

        VEGFEAST20: {
            itemIds: [
                1, 2, 5, 7, 8,
                9, 10, 11, 12,
                15, 16, 17, 18,
                19, 20
            ],
            discount: 20
        },

        CHICKENTHALI15: {
            itemIds: [62],
            discount: 15
        },

        MUTTONTHALI10: {
            itemIds: [63],
            discount: 10
        },

        FISHTHALI15: {
            itemIds: [64],
            discount: 15
        },

        ROYALTHALI20: {
            itemIds: [62, 63, 64, 65],
            discount: 20
        }

    };


    // ==========================================
    // GET OFFER RULE
    // ==========================================

    const offerRule =
        selectedOffer
            ? offerRules[selectedOffer.code]
            : null;


    // ==========================================
    // OFFER ITEMS
    // ==========================================

    const offerItems =
        offerRule?.itemIds
            ? cartItems.filter((item) =>
                offerRule.itemIds.includes(
                    Number(item.menu)
                )
            )
            : cartItems;


    // ==========================================
    // OFFER VALIDATION
    // ==========================================

    const offerInvalid =
        selectedOffer &&
        offerRule?.itemIds &&
        offerItems.length === 0;


    // ==========================================
    // DISCOUNT
    // ==========================================

    const discount =
        !offerInvalid && offerRule
            ? offerItems.reduce(

                (sum, item) => {

                    return (
                        sum +
                        Number(
                            item.total_price || 0
                        )
                    );

                },

                0

            ) *
            (offerRule.discount / 100)

            : 0;


    // ==========================================
    // FINAL TOTAL
    // ==========================================

    const finalTotal =
        Math.max(
            0,
            subtotal - discount
        );


    // ==========================================
    // REMOVE OFFER
    // ==========================================

    const removeOffer = () => {

        localStorage.removeItem(
            "selectedOffer"
        );

        setSelectedOffer(null);

    };


    // ==========================================
    // CONFIRM ORDER
    // ==========================================

    const confirmOrder = async () => {

        const userId =
            localStorage.getItem("userId");


        let fullAddress;


        // ======================================
        // SAVED ADDRESS
        // ======================================

        if (hasAddress) {

            fullAddress =
                addressData.full_name;

        }


        // ======================================
        // NEW ADDRESS
        // ======================================

        else {

            if (

                !addressData.full_name ||
                !addressData.phone_number ||
                !addressData.house_no ||
                !addressData.street ||
                !addressData.city ||
                !addressData.state ||
                !addressData.pincode

            ) {

                alert(
                    "Please fill all address details"
                );

                return;

            }


            fullAddress = `

                ${addressData.full_name},
                ${addressData.phone_number},
                ${addressData.house_no},
                ${addressData.street},
                ${addressData.city},
                ${addressData.state},
                ${addressData.pincode}

            `.trim();


            // SAVE ADDRESS

            try {

                await updateUser(

                    userId,

                    {
                        address:
                            fullAddress
                    }

                );

            } catch (error) {

                console.log(
                    "ADDRESS UPDATE ERROR:",
                    error
                );

                alert(
                    "Failed to save address."
                );

                return;

            }

        }


        // ======================================
        // PLACE ORDER
        // ======================================

        try {

            console.log(
                "========== ORDER =========="
            );


            console.log(
                "USER ID:",
                userId
            );


            console.log(
                "SUBTOTAL:",
                subtotal
            );


            console.log(
                "OFFER:",
                selectedOffer
            );


            console.log(
                "DISCOUNT:",
                discount
            );


            console.log(
                "FINAL TOTAL:",
                finalTotal
            );


            // ==================================
            // ORDER DATA
            // ==================================

            const orderData = {

                user: userId,

                // IMPORTANT:
                // Send discounted amount
                total_price:
                    Number(
                        finalTotal.toFixed(2)
                    ),

                address:
                    fullAddress,

            };


            // ==================================
            // GROUP ORDER
            // ==================================

            if (
                isGroupOrder &&
                groupCode
            ) {

                orderData.group_code =
                    groupCode;

            }


            console.log(
                "FINAL ORDER DATA:",
                orderData
            );


            // ==================================
            // CALL API
            // ==================================

            const response =
                await placeOrder(
                    orderData
                );


            console.log(
                "ORDER RESPONSE:",
                response.data
            );


            // ==================================
            // GET ORDER ID
            // ==================================

            const orderId =
                response.data?.order?.id;


            if (!orderId) {

                alert(
                    "Order created, but Order ID was not received."
                );

                return;

            }


            console.log(
                "ORDER ID:",
                orderId
            );


            // ==================================
            // GO TO PAYMENT
            // ==================================

            navigate(
                `/payment/${orderId}`
            );


        } catch (error) {

            console.log(
                "ORDER ERROR:",
                error
            );


            console.log(
                "BACKEND RESPONSE:",
                JSON.stringify(
                    error.response?.data,
                    null,
                    2
                )
            );


            alert(

                JSON.stringify(

                    error.response?.data,

                    null,

                    2

                )

            );

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="place-order-container">


            <h2>
                Checkout
            </h2>


            {/* =================================
                GROUP ORDER NOTICE
            ================================= */}

            {isGroupOrder && (

                <div className="group-order-notice">

                    <h3>
                        👥 Group Order
                    </h3>


                    <p>

                        Group Code:{" "}

                        <strong>
                            {groupCode}
                        </strong>

                    </p>


                    <p>

                        All selected items
                        from the group are
                        included in this order.

                    </p>

                </div>

            )}


            <div className="checkout-container">


                {/* =================================
                    LEFT SIDE
                ================================= */}

                <div className="checkout-left">


                    <h3>
                        Order Summary
                    </h3>


                    {cartItems.map(
                        (item) => (

                            <div

                                className="order-card"

                                key={item.id}

                            >


                                {/* IMAGE */}

                                {item.menu_image && (

                                    <img

                                        src={
                                            item.menu_image
                                        }

                                        alt={
                                            item.menu_name
                                        }

                                    />

                                )}


                                <div>


                                    <h4>
                                        {
                                            item.menu_name
                                        }
                                    </h4>


                                    <p>

                                        Price : ₹
                                        {
                                            item.menu_price
                                        }

                                    </p>


                                    <p>

                                        Quantity :{" "}

                                        {
                                            item.quantity
                                        }

                                    </p>


                                    <p>

                                        Total : ₹

                                        {
                                            item.total_price
                                        }

                                    </p>


                                    {/* GROUP MEMBER */}

                                    {isGroupOrder &&
                                        item.username && (

                                            <p>

                                                Added by:{" "}

                                                <strong>

                                                    {
                                                        item.username
                                                    }

                                                </strong>

                                            </p>

                                        )

                                    }


                                </div>


                            </div>

                        )
                    )}


                    {/* =================================
                        SUBTOTAL
                    ================================= */}

                    <h3 className="order-total">

                        Subtotal : ₹
                        {subtotal.toFixed(2)}

                    </h3>


                    {/* =================================
                        OFFER
                    ================================= */}

                    {selectedOffer && (

                        <div className="checkout-offer">

                            {offerInvalid ? (

                                <>

                                    <p>
                                        ⚠️{" "}
                                        {selectedOffer.title}
                                    </p>

                                    <p>
                                        This offer is not
                                        valid for the items
                                        in your cart.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            removeOffer
                                        }
                                    >
                                        Remove Offer
                                    </button>

                                </>

                            ) : (

                                <>

                                    <p>

                                        🎁{" "}
                                        <strong>
                                            {
                                                selectedOffer.title
                                            }
                                        </strong>

                                    </p>


                                    <p>

                                        {
                                            offerRule?.discount ||
                                            selectedOffer.discount
                                        }% OFF

                                        {" - ₹"}

                                        {
                                            discount.toFixed(2)
                                        }

                                    </p>


                                    <button className="remove-offer-btn"
                                        type="button"
                                        onClick={
                                            removeOffer
                                        }
                                    >
                                        Remove Offer
                                    </button>

                                </>

                            )}

                        </div>

                    )}


                    {/* =================================
                        DISCOUNT
                    ================================= */}

                    {!offerInvalid &&
                        discount > 0 && (

                            <p className="discount-text">

                                Discount : - ₹
                                {discount.toFixed(2)}

                            </p>

                        )}


                    {/* =================================
                        FINAL TOTAL
                    ================================= */}

                    <h2 className="order-total">

                        Grand Total : ₹
                        {finalTotal.toFixed(2)}

                    </h2>


                </div>



                {/* =================================
                    RIGHT SIDE
                ================================= */}

                <div className="checkout-right">


                    {/* SAVED ADDRESS */}

                    {hasAddress ? (

                        <div className="saved-address">

                            <h3>
                                Delivery Address
                            </h3>


                            <p>
                                {
                                    addressData.full_name
                                }
                            </p>

                        </div>

                    ) : (


                        /* NEW ADDRESS */

                        <div className="address-form">

                            <h3>
                                Enter Delivery Address
                            </h3>


                            <input
                                name="full_name"
                                placeholder="Full Name"
                                value={
                                    addressData.full_name
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <input
                                name="phone_number"
                                placeholder="Phone Number"
                                value={
                                    addressData.phone_number
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <input
                                name="house_no"
                                placeholder="House No"
                                value={
                                    addressData.house_no
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <input
                                name="street"
                                placeholder="Street"
                                value={
                                    addressData.street
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <input
                                name="city"
                                placeholder="City"
                                value={
                                    addressData.city
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <input
                                name="state"
                                placeholder="State"
                                value={
                                    addressData.state
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            <input
                                name="pincode"
                                placeholder="Pincode"
                                value={
                                    addressData.pincode
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    )}


                    {/* =================================
                        CONTINUE TO PAYMENT
                    ================================= */}

                    <button

                        className="confirm-order-btn"

                        onClick={
                            confirmOrder
                        }

                    >

                        Continue to Payment

                    </button>


                </div>


            </div>


        </div>

    );

}


export default AddOrder;