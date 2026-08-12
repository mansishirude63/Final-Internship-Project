import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getMenus } from "../../api/menuApi";

import {
    getGroupOrder,
    addGroupCartItem,
    getGroupCart,
    removeGroupCartItem
} from "../../api/groupOrderApi";

import "./GroupRoom.css";

function GroupRoom() {

    const { groupCode } = useParams();
    const navigate = useNavigate();

    const [menus, setMenus] = useState([]);
    const [group, setGroup] = useState(null);
    const [groupCart, setGroupCart] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [addingItem, setAddingItem] = useState(null);

    const [showAddPopup, setShowAddPopup] = useState(false);
    const [addedItemName, setAddedItemName] = useState("");

    // ================================
    // GROUP BUDGET
    // ================================

    const [showBudgetPopup, setShowBudgetPopup] =
        useState(false);

    const [groupBudget, setGroupBudget] =
        useState("");

    const [budgetMeals, setBudgetMeals] =
        useState([]);

    const [budgetSearched, setBudgetSearched] =
        useState(false);

    const [addingBudgetMeal, setAddingBudgetMeal] =
        useState(false);

    const userId = localStorage.getItem("userId");


    // ================================
    // LOAD GROUP
    // ================================

    useEffect(() => {

        if (!userId) {
            navigate("/login");
            return;
        }

        loadGroup();

    }, [groupCode]);


    const loadGroup = async () => {

        try {

            setLoading(true);

            const [
                groupResponse,
                menuResponse,
                cartResponse
            ] = await Promise.all([
                getGroupOrder(groupCode),
                getMenus(),
                getGroupCart(groupCode)
            ]);

            setGroup(groupResponse);

            setMenus(
                menuResponse.data.menu
            );

            setGroupCart(
                cartResponse.items || []
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Failed to load group."
            );

        } finally {

            setLoading(false);

        }

    };


    // ================================
    // ADD TO GROUP CART
    // ================================

    const addToGroupCart = async (menu) => {

        try {

            setAddingItem(menu.id);

            await addGroupCartItem(
                groupCode,
                userId,
                menu.id,
                1
            );

            const cartResponse =
                await getGroupCart(groupCode);

            setGroupCart(
                cartResponse.items || []
            );

            setAddedItemName(menu.name);

            setShowAddPopup(true);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Failed to add item."
            );

        } finally {

            setAddingItem(null);

        }

    };


    // ================================
    // REMOVE ITEM
    // ================================

    const removeFromGroupCart = async (itemId) => {

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


    // ================================
    // TOTAL
    // ================================

    const calculateTotal = () => {

        return groupCart.reduce(
            (total, item) =>
                total + Number(item.total_price),
            0
        );

    };


    // ================================
    // CHECK MY ITEM
    // ================================

    const isMyItem = (item) => {

        return String(item.user) ===
            String(userId);

    };


    // ================================
    // GROUP MEMBERS COUNT
    // ================================

    const memberCount =
        group?.members?.length || 1;


    // ================================
    // GENERATE GROUP BUDGET MEALS
    // ================================

    const generateGroupBudgetMeals = () => {

        const amount = Number(groupBudget);

        if (!amount || amount <= 0) {

            alert(
                "Please enter a valid group budget."
            );

            return;

        }


        const availableItems = menus.filter(
            menu =>
                Number(menu.price) <= amount
        );


        if (availableItems.length === 0) {

            setBudgetMeals([]);
            setBudgetSearched(true);

            return;

        }


        const combinations = [];


        // ============================
        // SINGLE ITEM
        // ============================

        for (
            let i = 0;
            i < availableItems.length;
            i++
        ) {

            const item1 =
                availableItems[i];

            const total1 =
                Number(item1.price);


            if (total1 <= amount) {

                combinations.push({

                    items: [item1],

                    total: total1

                });

            }


            // ============================
            // TWO ITEMS
            // ============================

            for (
                let j = i + 1;
                j < availableItems.length;
                j++
            ) {

                const item2 =
                    availableItems[j];

                const total2 =
                    Number(item1.price) +
                    Number(item2.price);


                if (total2 <= amount) {

                    combinations.push({

                        items: [
                            item1,
                            item2
                        ],

                        total: total2

                    });

                }


                // ============================
                // THREE ITEMS
                // ============================

                for (
                    let k = j + 1;
                    k < availableItems.length;
                    k++
                ) {

                    const item3 =
                        availableItems[k];

                    const total3 =
                        Number(item1.price) +
                        Number(item2.price) +
                        Number(item3.price);


                    if (total3 <= amount) {

                        combinations.push({

                            items: [
                                item1,
                                item2,
                                item3
                            ],

                            total: total3

                        });

                    }

                }

            }

        }


        // ============================
        // REMOVE DUPLICATES
        // ============================

        const uniqueMeals =
            combinations.filter(
                (meal, index, self) => {

                    const ids =
                        meal.items
                            .map(item => item.id)
                            .sort()
                            .join("-");


                    return (
                        index ===
                        self.findIndex(
                            other => {

                                const otherIds =
                                    other.items
                                        .map(
                                            item =>
                                                item.id
                                        )
                                        .sort()
                                        .join("-");


                                return (
                                    ids ===
                                    otherIds
                                );

                            }
                        )
                    );

                }
            );


        // ============================
        // SORT MEALS
        // ============================

        uniqueMeals.sort(
            (a, b) => {

                // Prefer more items
                if (
                    b.items.length !==
                    a.items.length
                ) {

                    return (
                        b.items.length -
                        a.items.length
                    );

                }

                // Closest to budget
                return b.total - a.total;

            }
        );


        // ============================
        // SHOW BEST 6
        // ============================

        setBudgetMeals(
            uniqueMeals.slice(0, 6)
        );

        setBudgetSearched(true);

    };


    // ================================
    // ADD COMPLETE BUDGET MEAL
    // ================================

    const addGroupBudgetMeal = async (meal) => {

        try {

            setAddingBudgetMeal(true);


            for (
                const item of meal.items
            ) {

                await addGroupCartItem(
                    groupCode,
                    userId,
                    item.id,
                    1
                );

            }


            const cartResponse =
                await getGroupCart(groupCode);


            setGroupCart(
                cartResponse.items || []
            );


            setShowBudgetPopup(false);

            setBudgetSearched(false);

            setBudgetMeals([]);

            setGroupBudget("");


            setAddedItemName(
                meal.items
                    .map(item => item.name)
                    .join(", ")
            );


            setShowAddPopup(true);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.error ||
                "Failed to add group meal."
            );

        } finally {

            setAddingBudgetMeal(false);

        }

    };


    // ================================
    // LOADING
    // ================================

    if (loading) {

        return (
            <div className="group-loading">
                Loading group...
            </div>
        );

    }


    // ================================
    // GROUP NOT FOUND
    // ================================

    if (!group) {

        return (

            <div className="group-error-page">

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


    // ================================
    // SEARCH
    // ================================

    const filteredMenus =
        menus.filter(menu => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            return (

                menu.name
                    .toLowerCase()
                    .includes(searchText) ||

                menu.description
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    // ================================
    // CATEGORIES
    // ================================

    const starters =
        filteredMenus.filter(
            menu =>
                menu.category === "Starter"
        );


    const mainCourses =
        filteredMenus.filter(
            menu =>
                menu.category === "Main Course"
        );


    const desserts =
        filteredMenus.filter(
            menu =>
                menu.category === "Dessert"
        );


    const beverages =
        filteredMenus.filter(
            menu =>
                menu.category === "Beverage"
        );


    // ================================
    // RENDER CATEGORY
    // ================================

    const renderCategory =
        (title, items) => {

            if (items.length === 0) {
                return null;
            }


            return (

                <section
                    className="group-menu-category"
                >

                    <h2>
                        {title}
                    </h2>


                    <div
                        className="group-menu-grid"
                    >

                        {items.map(menu => (

                            <div
                                className="group-menu-card"
                                key={menu.id}
                            >

                                {menu.image && (

                                    <img
                                        src={
                                            `http://127.0.0.1:8000${menu.image}`
                                        }
                                        alt={menu.name}
                                        className="group-menu-image"
                                    />

                                )}


                                <div
                                    className="group-menu-content"
                                >

                                    <h3>
                                        {menu.name}
                                    </h3>


                                    <p>
                                        {menu.description}
                                    </p>


                                    <div
                                        className="group-menu-bottom"
                                    >

                                        <strong>
                                            ₹{menu.price}
                                        </strong>


                                        <button
                                            onClick={() =>
                                                addToGroupCart(
                                                    menu
                                                )
                                            }
                                            disabled={
                                                addingItem ===
                                                menu.id
                                            }
                                        >

                                            {addingItem ===
                                            menu.id
                                                ? "Adding..."
                                                : "+ Add"
                                            }

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            );

        };


    return (

        <div className="group-room-page">


            {/* HEADER */}

            <div className="group-room-header">

                <button
                    className="group-back-button"
                    onClick={() =>
                        navigate(
                            "/group-order"
                        )
                    }
                >
                    ← Back
                </button>


                <div>

                    <h1>
                        👥 Group Order
                    </h1>

                    <p>
                        Order food together
                    </p>

                </div>

            </div>


            {/* GROUP INFORMATION */}

            <div className="group-info-card">

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
                        👥 Members
                    </span>

                    <strong>
                        {memberCount}
                    </strong>

                </div>


                <button
                    onClick={() => {

                        navigator.clipboard.writeText(
                            group.group_code
                        );

                        alert(
                            "Group code copied!"
                        );

                    }}
                >
                    📋 Copy Code
                </button>

            </div>


            {/* GROUP MEMBERS */}

            <div className="group-members-card">

                <h2>
                    👥 Members
                </h2>


                <div className="group-members">

                    {group.members?.map(
                        member => (

                            <div
                                className="group-member"
                                key={member.id}
                            >

                                <span
                                    className="member-icon"
                                >
                                    👤
                                </span>


                                <span>

                                    {member.username}

                                    {String(
                                        member.user
                                    ) ===
                                        String(
                                            group.created_by
                                        ) && (

                                            <small>
                                                {" "}
                                                (Creator)
                                            </small>

                                        )}

                                </span>

                            </div>

                        )
                    )}

                </div>

            </div>


            {/* GROUP BUDGET */}

            <div className="group-budget-section">

                <div>

                    <h2>
                        💰 Plan a Group Meal
                    </h2>

                    <p>
                        Tell us your total budget
                        and we'll find a meal for
                        everyone.
                    </p>

                </div>


                <button
                    className="group-budget-button"
                    onClick={() => {

                        setGroupBudget("");
                        setBudgetMeals([]);
                        setBudgetSearched(false);

                        setShowBudgetPopup(true);

                    }}
                >
                    💰 Group Meal Budget
                </button>

            </div>


            {/* MENU */}

            <div className="group-menu-section">

                <div className="group-menu-heading">

                    <h2>
                        🍽️ Choose Your Food
                    </h2>

                    <p>
                        Everyone can add their
                        own food
                    </p>

                </div>


                <div className="group-menu-search">

                    <span>
                        🔍
                    </span>


                    <input
                        type="text"
                        placeholder="Search for food..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />


                    {search && (

                        <button
                            className="group-search-clear"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ✕
                        </button>

                    )}

                </div>


                {filteredMenus.length === 0 ? (

                    <div className="group-no-food">

                        <div>
                            🔍
                        </div>

                        <h3>
                            No food found
                        </h3>

                        <p>
                            Try searching for
                            another food item.
                        </p>


                        <button
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            Show All Menu
                        </button>

                    </div>

                ) : (

                    <>

                        {renderCategory(
                            "Starters",
                            starters
                        )}

                        {renderCategory(
                            "Main Course",
                            mainCourses
                        )}

                        {renderCategory(
                            "Desserts",
                            desserts
                        )}

                        {renderCategory(
                            "Beverages",
                            beverages
                        )}

                    </>

                )}

            </div>


            {/* GROUP CART PREVIEW */}

            <div className="group-cart-card">

                <div className="group-cart-header">

                    <div>

                        <h2>
                            🛒 Group Cart
                        </h2>

                        <p>
                            Everyone's selected food
                        </p>

                    </div>


                    <strong>
                        ₹{calculateTotal().toFixed(2)}
                    </strong>

                </div>


                {groupCart.length === 0 ? (

                    <div className="empty-group-cart">

                        <div>
                            🛒
                        </div>

                        <h3>
                            Group cart is empty
                        </h3>

                        <p>
                            Start adding some
                            delicious food!
                        </p>

                    </div>

                ) : (

                    <>

                        <div className="group-cart-items">

                            {groupCart.map(
                                item => (

                                    <div
                                        className="group-cart-item"
                                        key={item.id}
                                    >

                                        <div>

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
                                                ₹
                                                {item.menu_price}
                                                {" "}×{" "}
                                                {item.quantity}
                                            </p>

                                        </div>


                                        <div
                                            className="group-cart-item-right"
                                        >

                                            <strong>
                                                ₹
                                                {item.total_price}
                                            </strong>


                                            {isMyItem(
                                                item
                                            ) && (

                                                <button
                                                    onClick={() =>
                                                        removeFromGroupCart(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            )}

                                        </div>

                                    </div>
                                )
                            )}

                        </div>


                        <button
                            className="open-group-cart-button"
                            onClick={() =>
                                navigate(
                                    `/group-order/${groupCode}/cart`
                                )
                            }
                        >
                            🛒 View Full Group Cart
                        </button>

                    </>

                )}

            </div>


            {/* ============================= */}
            {/* GROUP BUDGET POPUP */}
            {/* ============================= */}

            {showBudgetPopup && (

                <div className="group-popup-overlay">

                    <div className="group-budget-popup">

                        <button
                            className="group-popup-close"
                            onClick={() =>
                                setShowBudgetPopup(false)
                            }
                        >
                            ✕
                        </button>


                        <div className="group-budget-icon">
                            👥💰
                        </div>


                        <h2>
                            Group Meal Budget
                        </h2>


                        <p>
                            Plan a meal for{" "}
                            <strong>
                                {memberCount}
                            </strong>{" "}
                            group member
                            {memberCount !== 1
                                ? "s"
                                : ""}
                        </p>


                        {/* BUDGET INPUT */}

                        <div className="group-budget-input">

                            <span>
                                ₹
                            </span>


                            <input
                                type="number"
                                min="1"
                                placeholder="Enter total budget"
                                value={groupBudget}
                                onChange={(e) =>
                                    setGroupBudget(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            className="find-group-meals-button"
                            onClick={
                                generateGroupBudgetMeals
                            }
                        >
                            ✨ Find Group Meals
                        </button>


                        {/* RESULTS */}

                        {budgetSearched &&
                            budgetMeals.length > 0 && (

                                <div className="group-budget-results">

                                    <h3>
                                        ✨ Recommended Group Meals
                                    </h3>


                                    {budgetMeals.map(
                                        (
                                            meal,
                                            index
                                        ) => (

                                            <div
                                                className="group-budget-meal-card"
                                                key={index}
                                            >

                                                {/* FOOD ITEMS - NO IMAGES */}

                                                <div className="group-budget-items">

                                                    {meal.items.map(
                                                        item => (

                                                            <div
                                                                className="group-budget-item"
                                                                key={
                                                                    item.id
                                                                }
                                                            >

                                                                <span>
                                                                    {
                                                                        item.name
                                                                    }
                                                                </span>

                                                                <span>
                                                                    ₹
                                                                    {
                                                                        item.price
                                                                    }
                                                                </span>

                                                            </div>

                                                        )
                                                    )}

                                                </div>


                                                {/* TOTAL */}

                                                <div className="group-budget-meal-bottom">

                                                    <div>

                                                        <strong>
                                                            Total: ₹
                                                            {
                                                                meal.total
                                                            }
                                                        </strong>


                                                        <small>
                                                            ₹
                                                            {Number(
                                                                groupBudget
                                                            ) -
                                                                meal.total}
                                                            {" "}
                                                            remaining
                                                        </small>

                                                    </div>


                                                    <button
                                                        onClick={() =>
                                                            addGroupBudgetMeal(
                                                                meal
                                                            )
                                                        }
                                                        disabled={
                                                            addingBudgetMeal
                                                        }
                                                    >

                                                        {addingBudgetMeal
                                                            ? "Adding..."
                                                            : "Add Group Meal"
                                                        }

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}


                        {/* NO RESULTS */}

                        {budgetSearched &&
                            budgetMeals.length === 0 && (

                                <div className="no-group-budget-meals">

                                    😕 No group meal
                                    found within ₹
                                    {groupBudget}.

                                    <br />

                                    Try increasing
                                    your budget.

                                </div>

                            )}

                    </div>

                </div>

            )}


            {/* ADD POPUP */}

            {showAddPopup && (

                <div className="group-popup-overlay">

                    <div className="group-add-popup">

                        <button
                            className="group-popup-close"
                            onClick={() =>
                                setShowAddPopup(false)
                            }
                        >
                            ✕
                        </button>


                        <div className="group-popup-icon">
                            ✅
                        </div>


                        <h2>
                            Item Added!
                        </h2>


                        <p>
                            <strong>
                                {addedItemName}
                            </strong>{" "}
                            was added to your
                            group cart.
                        </p>


                        <div className="group-popup-buttons">

                            <button
                                className="continue-group-button"
                                onClick={() =>
                                    setShowAddPopup(false)
                                }
                            >
                                Continue Ordering
                            </button>


                            <button
                                className="view-group-cart-button"
                                onClick={() => {

                                    setShowAddPopup(false);

                                    navigate(
                                        `/group-order/${groupCode}/cart`
                                    );

                                }}
                            >
                                🛒 View Group Cart
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default GroupRoom;