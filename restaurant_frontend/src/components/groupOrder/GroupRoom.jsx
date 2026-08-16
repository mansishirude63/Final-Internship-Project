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
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedFoodType, setSelectedFoodType] = useState("All");

    const [loading, setLoading] = useState(true);
    const [addingItem, setAddingItem] = useState(null);

    // Add popup
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [addedItemName, setAddedItemName] = useState("");

    // Group budget
    const [showBudgetPopup, setShowBudgetPopup] = useState(false);
    const [groupBudget, setGroupBudget] = useState("");
    const [budgetMeals, setBudgetMeals] = useState([]);
    const [budgetSearched, setBudgetSearched] = useState(false);
    const [addingBudgetMeal, setAddingBudgetMeal] = useState(false);

    const userId = localStorage.getItem("userId");


    // =========================================
    // LOAD GROUP
    // =========================================

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
                menuResponse.data.menu || []
            );

            setGroupCart(
                cartResponse.items || []
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to load group."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // CHECK IF ITEM IS IN GROUP CART
    // =========================================

    const isItemInGroupCart = (menuId) => {

        return groupCart.some(
            (item) =>
                String(item.menu) === String(menuId) ||
                String(item.menu_id) === String(menuId)
        );

    };


    // =========================================
    // ADD TO GROUP CART
    // =========================================

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
                error.response?.data?.message ||
                "Failed to add item."
            );

        } finally {

            setAddingItem(null);

        }

    };


    // =========================================
    // REMOVE GROUP CART ITEM
    // =========================================

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
                error.response?.data?.message ||
                "Failed to remove item."
            );

        }

    };


    // =========================================
    // TOTAL
    // =========================================

    const calculateTotal = () => {

        return groupCart.reduce(
            (total, item) =>
                total + Number(item.total_price || 0),
            0
        );

    };


    // =========================================
    // CHECK MY ITEM
    // =========================================

    const isMyItem = (item) => {

        return String(item.user) ===
            String(userId);

    };


    // =========================================
    // MEMBER COUNT
    // =========================================

    const memberCount =
        group?.members?.length || 1;


    // =========================================
    // GROUP BUDGET MEALS
    // =========================================

    const generateGroupBudgetMeals = () => {

        const amount =
            Number(groupBudget);

        if (!amount || amount <= 0) {

            alert(
                "Please enter a valid group budget."
            );

            return;

        }

        const availableItems =
            menus.filter(
                menu =>
                    Number(menu.price) <= amount
            );

        if (availableItems.length === 0) {

            setBudgetMeals([]);
            setBudgetSearched(true);

            return;

        }

        const combinations = [];


        // Single / Two / Three items

        for (
            let i = 0;
            i < availableItems.length;
            i++
        ) {

            const item1 =
                availableItems[i];

            const total1 =
                Number(item1.price);


            // Single item

            if (total1 <= amount) {

                combinations.push({

                    items: [item1],
                    total: total1

                });

            }


            // Two + Three items

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


                // Three items

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


        // Remove duplicates

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


        // Sort

        uniqueMeals.sort(
            (a, b) => {

                if (
                    b.items.length !==
                    a.items.length
                ) {

                    return (
                        b.items.length -
                        a.items.length
                    );

                }

                return b.total - a.total;

            }
        );


        setBudgetMeals(
            uniqueMeals.slice(0, 6)
        );

        setBudgetSearched(true);

    };


    // =========================================
    // ADD COMPLETE BUDGET MEAL
    // =========================================

    const addGroupBudgetMeal =
        async (meal) => {

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
                    await getGroupCart(
                        groupCode
                    );

                setGroupCart(
                    cartResponse.items || []
                );

                setShowBudgetPopup(false);
                setBudgetSearched(false);
                setBudgetMeals([]);
                setGroupBudget("");

                setAddedItemName(
                    meal.items
                        .map(
                            item => item.name
                        )
                        .join(", ")
                );

                setShowAddPopup(true);

            } catch (error) {

                console.log(error);

                alert(
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Failed to add group meal."
                );

            } finally {

                setAddingBudgetMeal(false);

            }

        };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="group-loading">
                Loading group...
            </div>

        );

    }


    // =========================================
    // GROUP NOT FOUND
    // =========================================

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


    // =========================================
    // SEARCH + FILTERS
    // =========================================

    const filteredMenus =
        menus.filter((menu) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();

            const matchesSearch =

                menu.name
                    .toLowerCase()
                    .includes(searchText) ||

                (menu.description || "")
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =

                selectedCategory === "All" ||

                menu.category ===
                selectedCategory;


            const matchesFoodType =

                selectedFoodType === "All" ||

                menu.food_type ===
                selectedFoodType;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesFoodType
            );

        });


    // =========================================
    // CATEGORY DATA
    // =========================================

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

    const thalis =
        filteredMenus.filter(
            menu =>
                menu.category === "Thali"
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


    // =========================================
    // RENDER MENU CATEGORY
    // =========================================

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

                        {items.map(
                            (menu) => (

                                <div
                                    className="group-menu-card"
                                    key={menu.id}
                                >

                                    {/* IMAGE */}

                                    {menu.image && (

                                        <img
                                            src={
                                                menu.image.startsWith("http")
                                                    ? menu.image
                                                    : `https://final-internship-project-kcp1.onrender.com${menu.image}`
                                            }
                                            alt={menu.name}
                                            className="group-menu-image"
                                            onClick={() =>
                                                navigate(
                                                    `/menu/${menu.id}`
                                                )
                                            }
                                        />

                                    )}


                                    {/* CONTENT */}

                                    <div
                                        className="group-menu-content"
                                    >

                                        <h3>
                                            {menu.name}
                                        </h3>

                                        <p>
                                            {menu.description}
                                        </p>


                                        {/* FOOD TYPE */}

                                        {menu.food_type && (

                                            <span
                                                className={
                                                    menu.food_type === "Veg"
                                                        ? "group-veg-badge"
                                                        : "group-nonveg-badge"
                                                }
                                            >

                                                {menu.food_type === "Veg"
                                                    ? "🟢 Veg"
                                                    : "🔴 Non-Veg"}

                                            </span>

                                        )}


                                        {/* PRICE + ADD */}

                                        <div
                                            className="group-menu-bottom"
                                        >

                                            <strong>
                                                ₹{menu.price}
                                            </strong>


                                            {/* ITEM ADDED MESSAGE */}

                                            {isItemInGroupCart(
                                                menu.id
                                            ) ? (

                                                <div className="item-added-message">

                                                    ✓ Item added to group cart

                                                </div>

                                            ) : (

                                                <button
                                                    type="button"
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
                                                        : "+ Add"}

                                                </button>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </section>

            );

        };


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="group-room-page">


            {/* HEADER */}

            <div className="group-room-header">

                <button
                    className="group-back-button"
                    onClick={() =>
                        navigate("/group-order")
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


                {/* SEARCH */}

                <div className="group-menu-search">

                    <span>
                        🔍
                    </span>


                    <input
                        type="text"
                        placeholder="Search for your favourite food..."
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


                {/* FOOD TYPE */}

                <div className="group-food-type-buttons">

                    <button
                        className={
                            selectedFoodType === "All"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedFoodType(
                                "All"
                            )
                        }
                    >
                        🍽️ All
                    </button>


                    <button
                        className={
                            selectedFoodType === "Veg"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedFoodType(
                                "Veg"
                            )
                        }
                    >
                        🟢 Veg
                    </button>


                    <button
                        className={
                            selectedFoodType === "Non-Veg"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedFoodType(
                                "Non-Veg"
                            )
                        }
                    >
                        🔴 Non-Veg
                    </button>

                </div>


                {/* CATEGORY BUTTONS */}

                <div className="group-category-buttons">

                    <button
                        className={
                            selectedCategory === "All"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "All"
                            )
                        }
                    >
                        🍽️ All
                    </button>


                    <button
                        className={
                            selectedCategory === "Starter"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Starter"
                            )
                        }
                    >
                        🥗 Starters
                    </button>


                    <button
                        className={
                            selectedCategory === "Main Course"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Main Course"
                            )
                        }
                    >
                        🍛 Main Course
                    </button>


                    <button
                        className={
                            selectedCategory === "Thali"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Thali"
                            )
                        }
                    >
                        🍱 Thalis
                    </button>


                    <button
                        className={
                            selectedCategory === "Dessert"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Dessert"
                            )
                        }
                    >
                        🍰 Desserts
                    </button>


                    <button
                        className={
                            selectedCategory === "Beverage"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "Beverage"
                            )
                        }
                    >
                        🥤 Beverages
                    </button>

                </div>


                {/* MENU */}

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
                            onClick={() => {

                                setSearch("");

                                setSelectedCategory(
                                    "All"
                                );

                                setSelectedFoodType(
                                    "All"
                                );

                            }}
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
                            "Thalis",
                            thalis
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


            {/* GROUP CART */}

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
                        ₹
                        {calculateTotal().toFixed(2)}
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


            {/* GROUP BUDGET POPUP */}

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
                            Plan a meal within your
                            group budget.
                        </p>


                        <div className="group-budget-input">

                            <span>
                                ₹
                            </span>


                            <input
                                type="number"
                                min="1"
                                placeholder="Enter group budget"
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
                            🔍 Find Group Meals
                        </button>


                        {budgetMeals.length > 0 && (

                            <div className="group-budget-results">

                                <h3>
                                    ✨ Recommended Group Meals
                                </h3>


                                {budgetMeals.map(
                                    (meal, index) => (

                                        <div
                                            className="group-budget-meal-card"
                                            key={index}
                                        >

                                            <div className="group-budget-items">

                                                {meal.items.map(
                                                    item => (

                                                        <div
                                                            className="group-budget-item"
                                                            key={item.id}
                                                        >

                                                            <span>
                                                                {item.name}
                                                            </span>

                                                            <span>
                                                                ₹
                                                                {item.price}
                                                            </span>

                                                        </div>

                                                    )
                                                )}

                                            </div>


                                            <div className="group-budget-meal-bottom">

                                                <strong>
                                                    Total:
                                                    ₹
                                                    {meal.total}
                                                </strong>


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
                                                        : "Add Group Meal"}

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


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


            {/* ADD SUCCESS POPUP */}

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
                            </strong>

                            {" "}was added to your
                            group cart.

                        </p>


                        <div className="group-popup-buttons">

                            <button
                                className="continue-group-button"
                                onClick={() =>
                                    setShowAddPopup(
                                        false
                                    )
                                }
                            >
                                Continue Ordering
                            </button>


                            <button
                                className="view-group-cart-button"
                                onClick={() => {

                                    setShowAddPopup(
                                        false
                                    );

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