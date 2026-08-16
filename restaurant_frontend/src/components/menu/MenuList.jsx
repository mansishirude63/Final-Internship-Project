import { useEffect, useState } from "react";
import { getMenus } from "../../api/menuApi";
import {
  addCartItem,
  getCartItems
} from "../../api/cartApi";
import { useNavigate } from "react-router-dom";

function MenuList() {

  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFoodType, setSelectedFoodType] = useState("All");

  // Cart
  const [cartItems, setCartItems] = useState([]);

  // Add to cart popup
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedItem, setAddedItem] = useState("");


  // Budget ordering
  const [showBudgetPopup, setShowBudgetPopup] = useState(false);
  const [budget, setBudget] = useState("");
  const [budgetMeals, setBudgetMeals] = useState([]);

  const navigate = useNavigate();


  // =========================
  // FETCH MENU
  // =========================

  useEffect(() => {
    fetchMenus();
    fetchCart();
  }, []);


  const fetchMenus = async () => {

    try {

      const response = await getMenus();

      console.log(response.data.menu);

      setMenus(response.data.menu);

    } catch (error) {

      console.log(error);
      alert("Failed to load menu");

    }

  };


  // =========================
  // FETCH CART
  // =========================

  const fetchCart = async () => {

    try {

      const userId = localStorage.getItem("userId");

      if (!userId) {
        return;
      }

      const response = await getCartItems(userId);

      setCartItems(response.data.cart || []);

    } catch (error) {

      console.log("Failed to load cart", error);

    }

  };


  // =========================
  // CHECK IF ITEM IS IN CART
  // =========================

  const isItemInCart = (menuId) => {

    return cartItems.some(
      (item) => Number(item.menu) === Number(menuId)
    );

  };


  // =========================
  // ADD SINGLE ITEM TO CART
  // =========================

  const addToCart = async (menu) => {

    try {

      const userId = localStorage.getItem("userId");

      if (!userId) {

        alert("Please login first");
        navigate("/login");

        return;

      }


      // Already in cart
      if (isItemInCart(menu.id)) {

        setAddedItem(menu.name);
        setShowCartPopup(true);

        return;

      }


      await addCartItem({

        user: userId,
        menu: menu.id,
        quantity: 1

      });


      // Update local cart state
      setCartItems((previous) => [

        ...previous,

        {
          menu: menu.id
        }

      ]);


      setAddedItem(menu.name);
      setShowCartPopup(true);

    } catch (error) {

      console.log(error);

      alert("Failed to add item");

    }

  };


  // =========================
  // GENERATE BUDGET MEALS
  // =========================

  const generateBudgetMeals = () => {

    const amount = Number(budget);

    if (!amount || amount <= 0) {

      alert("Please enter a valid budget");

      return;

    }


    const availableItems = menus.filter(
      menu => Number(menu.price) <= amount
    );


    if (availableItems.length === 0) {

      setBudgetMeals([]);

      return;

    }


    const combinations = [];


    // Single / Two / Three items

    for (let i = 0; i < availableItems.length; i++) {

      const item1 = availableItems[i];


      // Single item

      if (Number(item1.price) <= amount) {

        combinations.push({

          items: [item1],

          total: Number(item1.price)

        });

      }


      // Two items

      for (
        let j = i + 1;
        j < availableItems.length;
        j++
      ) {

        const item2 = availableItems[j];

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

          const item3 = availableItems[k];

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

    const uniqueMeals = combinations.filter(
      (meal, index, self) => {

        const ids = meal.items
          .map(item => item.id)
          .sort()
          .join("-");


        return (

          index ===

          self.findIndex(other => {

            const otherIds = other.items
              .map(item => item.id)
              .sort()
              .join("-");


            return ids === otherIds;

          })

        );

      }

    );


    // Sort

    uniqueMeals.sort((a, b) => {

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

    });


    setBudgetMeals(
      uniqueMeals.slice(0, 6)
    );

  };


  // =========================
  // ADD BUDGET MEAL
  // =========================

  const addBudgetMealToCart = async (meal) => {

    try {

      const userId =
        localStorage.getItem("userId");


      if (!userId) {

        alert("Please login first");

        navigate("/login");

        return;

      }


      for (const item of meal.items) {

        // Don't add duplicate items

        if (!isItemInCart(item.id)) {

          await addCartItem({

            user: userId,

            menu: item.id,

            quantity: 1

          });

        }

      }


      // Refresh cart

      await fetchCart();


      setShowBudgetPopup(false);


      setAddedItem(

        meal.items
          .map(item => item.name)
          .join(", ")

      );


      setShowCartPopup(true);

    } catch (error) {

      console.log(error);

      alert("Failed to add budget meal");

    }

  };


  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredMenus = menus.filter((menu) => {

    const matchesSearch =

      menu.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      menu.description
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );


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


  // =========================
  // CATEGORY RENDER
  // =========================

  const renderCategory = (
    title,
    items
  ) => {

    if (items.length === 0) {

      return null;

    }


    return (

      <section className="menu-category">

        <h2 className="category-title">
          {title}
        </h2>


        <div className="menu-list-grid">

          {items.map((menu) => (

            <div
              className="menu-list-card"
              key={menu.id}
            >

              {menu.image && (

                <img
                  src={
                    `https://final-internship-project-kcp1.onrender.com${menu.image}`
                  }
                  alt={menu.name}
                  className="menu-image"

                  onClick={() =>
                    navigate(
                      `/menu/${menu.id}`
                    )
                  }

                />

              )}


              <div className="menu-card-content">

                <h3>
                  {menu.name}
                </h3>


                <p>
                  {menu.description}
                </p>


                {/* FOOD TYPE */}

                {
                  menu.food_type && (

                    <span
                      className={
                        menu.food_type ===
                          "Veg"
                          ? "group-veg-badge"
                          : "group-nonveg-badge"
                      }
                    >

                      {menu.food_type ===
                        "Veg"
                        ? "🟢 Veg"
                        : "🔴 Non-Veg"}

                    </span>

                  )
                }

                <div className="menu-card-bottom">

                  <h4>
                    ₹{menu.price}
                  </h4>


                  {isItemInCart(menu.id) ? (

                    <div className="item-added-message">
                      ✓ Item added to cart
                    </div>

                  ) : (

                    <button
                      type="button"
                      onClick={() => addToCart(menu)}
                    >
                      + Add
                    </button>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    );

  };


  // =========================
  // CATEGORY FILTER
  // =========================

  const starters =
    filteredMenus.filter(
      menu =>
        menu.category ===
        "Starter"
    );


  const mainCourses =
    filteredMenus.filter(
      menu =>
        menu.category ===
        "Main Course"
    );


  const desserts =
    filteredMenus.filter(
      menu =>
        menu.category ===
        "Dessert"
    );


  const beverages =
    filteredMenus.filter(
      menu =>
        menu.category ===
        "Beverage"
    );


  // =========================
  // RETURN
  // =========================

  return (

    <div className="menu-list-container">


      {/* HEADER */}

      <div className="menu-header">

        <h1>
          Our Menu 🍽️
        </h1>

        <p>
          Delicious food made with love ❤️
        </p>

      </div>


      {/* BUDGET ORDER */}

      <div className="budget-order-section">

        <div>

          <h2>
            💰 Order Within Your Budget
          </h2>

          <p>
            Tell us your budget and we'll
            find tasty combinations for you!
          </p>

        </div>


        <button
          className="budget-order-btn"

          onClick={() => {

            setBudget("");
            setBudgetMeals([]);
            setShowBudgetPopup(true);

          }}

        >

          💰 Budget Order

        </button>

      </div>


      {/* SEARCH */}

      <div className="menu-search">

        <span>
          🔍
        </span>


        <input

          type="text"

          placeholder="Search for your favourite food..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

        />


        {search && (

          <button
            className="clear-search"

            onClick={() =>
              setSearch("")
            }

          >

            ✕

          </button>

        )}

      </div>


      {/* VEG / NON-VEG */}

      <div className="food-type-buttons">

        <button

          className={
            selectedFoodType === "All"
              ? "food-type-btn active"
              : "food-type-btn"
          }

          onClick={() =>
            setSelectedFoodType("All")
          }

        >

          🍽️ All

        </button>


        <button

          className={
            selectedFoodType === "Veg"
              ? "food-type-btn active"
              : "food-type-btn"
          }

          onClick={() =>
            setSelectedFoodType("Veg")
          }

        >

          🟢 Veg

        </button>


        <button

          className={
            selectedFoodType === "Non-Veg"
              ? "food-type-btn active"
              : "food-type-btn"
          }

          onClick={() =>
            setSelectedFoodType("Non-Veg")
          }

        >

          🔴 Non-Veg

        </button>

      </div>


      {/* CATEGORY BUTTONS */}

      <div className="category-buttons">

        <button

          className={
            selectedCategory === "All"
              ? "active"
              : ""
          }

          onClick={() =>
            setSelectedCategory("All")
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
            setSelectedCategory("Starter")
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
            setSelectedCategory("Main Course")
          }

        >

          🍛 Main Course

        </button>


        <button

          className={
            selectedCategory === "Dessert"
              ? "active"
              : ""
          }

          onClick={() =>
            setSelectedCategory("Dessert")
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
            setSelectedCategory("Beverage")
          }

        >

          🥤 Beverages

        </button>

      </div>


      {/* MENU */}

      {filteredMenus.length > 0 ? (

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

      ) : (

        <div className="no-menu">

          <div>
            🔍
          </div>

          <h2>
            No food found
          </h2>

          <p>
            Try searching for another food item.
          </p>


          <button

            onClick={() => {

              setSearch("");
              setSelectedCategory("All");
              setSelectedFoodType("All");

            }}

          >

            Show All Menu

          </button>

        </div>

      )}


      {/* =========================
          BUDGET POPUP
      ========================= */}

      {showBudgetPopup && (

        <div className="cart-popup-overlay">

          <div className="budget-popup">

            <button
              className="budget-close"

              onClick={() =>
                setShowBudgetPopup(false)
              }

            >

              ✕

            </button>


            <div className="budget-icon">
              💰
            </div>


            <h2>
              Budget Order
            </h2>


            <p>
              How much do you want to spend?
            </p>


            <div className="budget-input-box">

              <span>
                ₹
              </span>


              <input

                type="number"

                min="1"

                placeholder="Enter your budget"

                value={budget}

                onChange={(e) =>
                  setBudget(e.target.value)
                }

              />

            </div>


            <button

              className="find-meals-btn"

              onClick={generateBudgetMeals}

            >

              🔍 Find Meals

            </button>


            {budgetMeals.length > 0 && (

              <div className="budget-results">

                <h3>
                  ✨ Recommended Meals
                </h3>


                {budgetMeals.map(
                  (meal, index) => (

                    <div
                      className="budget-meal-card"
                      key={index}
                    >

                      <div className="budget-meal-items">

                        {meal.items.map(
                          (item) => (

                            <div
                              className="budget-meal-item"
                              key={item.id}
                            >

                              <span>
                                {item.name}
                              </span>

                              <span>
                                ₹{item.price}
                              </span>

                            </div>

                          )
                        )}

                      </div>


                      <div className="budget-meal-bottom">

                        <strong>
                          Total: ₹{meal.total}
                        </strong>


                        <button

                          onClick={() =>
                            addBudgetMealToCart(meal)
                          }

                        >

                          Add This Meal

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}


            {budget &&
              budgetMeals.length === 0 && (

                <div className="no-budget-meals">

                  😕 No meal combination found
                  within ₹{budget}.

                  <br />

                  Try increasing your budget.

                </div>

              )}

          </div>

        </div>

      )}


      {/* =========================
          CART SUCCESS POPUP
      ========================= */}

      {showCartPopup && (

        <div className="cart-popup-overlay">

          <div className="cart-popup">

            <div className="cart-popup-icon">
              🛒
            </div>


            <h2>
              {isItemInCart(
                menus.find(
                  menu =>
                    menu.name === addedItem
                )?.id
              )
                ? "Already in Cart"
                : "Added to Cart!"}
            </h2>


            <p>

              <strong>
                {addedItem}
              </strong>

              {" "}

              {isItemInCart(
                menus.find(
                  menu =>
                    menu.name === addedItem
                )?.id
              )
                ? "is already in your cart."
                : "has been added to your cart."}

            </p>


            <div className="cart-popup-buttons">

              <button

                className="continue-shopping-btn"

                onClick={() =>
                  setShowCartPopup(false)
                }

              >

                Continue Shopping

              </button>


              <button

                className="view-cart-btn"

                onClick={() => {

                  setShowCartPopup(false);

                  navigate("/cart");

                }}

              >

                View Cart 🛒

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default MenuList;