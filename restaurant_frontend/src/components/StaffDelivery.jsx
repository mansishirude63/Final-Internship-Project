import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
    "http://127.0.0.1:8000/api";

function StaffDelivery() {

    const [section, setSection] = useState("menu");

    const [menu, setMenu] = useState([]);
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);

    // =========================
    // MENU FORM
    // =========================

    const [menuName, setMenuName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [image, setImage] = useState(null);

    const [editingMenu, setEditingMenu] = useState(null);

    // =========================
    // GROUP ORDER
    // =========================

    const [groupCode, setGroupCode] = useState("");
    const [groupData, setGroupData] = useState(null);

    // =========================
    // FETCH MENU
    // =========================

    const fetchMenu = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/menu/get_menu/`
            );

            if (response.data.success) {
                setMenu(response.data.menu);
            }

        } catch (error) {

            console.error("Error fetching menu:", error);

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // FETCH ORDERS
    // =========================

    const fetchOrders = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/orders/get_all_orders/`
            );

            if (response.data.success) {
                setOrders(response.data.orders);
            }

        } catch (error) {

            console.error("Error fetching orders:", error);

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // FETCH PAYMENTS
    // =========================

    const fetchPayments = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/payments/`
            );

            if (response.data) {
                setPayments(response.data);
            }

        } catch (error) {

            console.error("Error fetching payments:", error);

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // FETCH DELIVERIES
    // =========================

    const fetchDeliveries = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/delivery/get_all_deliveries/`
            );

            if (response.data.success) {
                setDeliveries(response.data.deliveries);
            }

        } catch (error) {

            console.error(
                "Error fetching deliveries:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // FETCH USERS
    // =========================

    const fetchUsers = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/accounts/get_all_Users/`
            );

            if (response.data.success) {
                setUsers(response.data.users);
            }

        } catch (error) {

            console.error("Error fetching users:", error);

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        if (section === "menu") {
            fetchMenu();
        }

        if (section === "orders") {
            fetchOrders();
        }

        if (section === "payments") {
            fetchPayments();
        }

        if (section === "deliveries") {
            fetchDeliveries();
        }

        if (section === "users") {
            fetchUsers();
        }

    }, [section]);

    // =========================
    // ADD / UPDATE MENU
    // =========================

    const saveMenu = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("name", menuName);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("price", price);
            formData.append(
                "is_available",
                isAvailable
            );

            if (image) {
                formData.append("image", image);
            }

            let response;

            if (editingMenu) {

                response = await axios.put(
                    `${API_URL}/menu/update_menu/${editingMenu.id}/`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

            } else {

                response = await axios.post(
                    `${API_URL}/menu/add_menu/`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );
            }

            if (response.data.success) {

                alert(
                    editingMenu
                        ? "Menu updated successfully!"
                        : "Menu added successfully!"
                );

                clearMenuForm();
                fetchMenu();
            }

        } catch (error) {

            console.error(
                "Error saving menu:",
                error
            );

            console.log(
                error.response?.data
            );

            alert("Failed to save menu.");

        }
    };

    // =========================
    // CLEAR MENU FORM
    // =========================

    const clearMenuForm = () => {

        setMenuName("");
        setCategory("");
        setDescription("");
        setPrice("");
        setIsAvailable(true);
        setImage(null);
        setEditingMenu(null);

        const fileInput =
            document.getElementById("menu-image");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // =========================
    // EDIT MENU
    // =========================

    const editMenu = (item) => {

        setEditingMenu(item);

        setMenuName(item.name || "");
        setCategory(item.category || "");
        setDescription(item.description || "");
        setPrice(item.price || "");
        setIsAvailable(
            item.is_available ?? true
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // DELETE MENU
    // =========================

    const deleteMenu = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this menu?"
            )
        ) {
            return;
        }

        try {

            const response = await axios.delete(
                `${API_URL}/menu/delete_menu/${id}/`
            );

            if (response.data.success) {

                alert(
                    "Menu deleted successfully!"
                );

                fetchMenu();
            }

        } catch (error) {

            console.error(
                "Error deleting menu:",
                error
            );

            alert("Failed to delete menu.");

        }
    };

    // =========================
    // UPDATE ORDER
    // =========================

    const updateOrder = async (
        orderId,
        newStatus
    ) => {

        try {

            const response = await axios.put(
                `${API_URL}/orders/update_order/${orderId}/`,
                {
                    status: newStatus
                }
            );

            if (response.data.success) {

                alert(
                    "Order status updated!"
                );

                fetchOrders();
            }

        } catch (error) {

            console.error(
                "Error updating order:",
                error
            );

            alert(
                "Failed to update order."
            );
        }
    };

    // =========================
    // DELETE ORDER
    // =========================

    const deleteOrder = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this order?"
            )
        ) {
            return;
        }

        try {

            const response = await axios.delete(
                `${API_URL}/orders/delete_order/${id}/`
            );

            if (response.data.success) {

                alert(
                    "Order deleted successfully!"
                );

                fetchOrders();
            }

        } catch (error) {

            console.error(
                "Error deleting order:",
                error
            );

            alert(
                "Failed to delete order."
            );
        }
    };

    // =========================
    // UPDATE DELIVERY
    // =========================

    const updateDelivery = async (
        deliveryId,
        newStatus
    ) => {

        try {

            const response = await axios.put(
                `${API_URL}/delivery/update_delivery/${deliveryId}/`,
                {
                    delivery_status: newStatus
                }
            );

            if (response.data.success) {

                alert(
                    "Delivery status updated!"
                );

                fetchDeliveries();
            }

        } catch (error) {

            console.error(
                "Error updating delivery:",
                error
            );

            alert(
                "Failed to update delivery."
            );
        }
    };

    // =========================
    // UPDATE USER
    // =========================

    const updateUser = async (
        userId,
        newStatus
    ) => {

        try {

            const response = await axios.put(
                `${API_URL}/accounts/update_User/${userId}/`,
                {
                    status: newStatus
                }
            );

            if (response.data.success) {

                alert(
                    "User updated successfully!"
                );

                fetchUsers();
            }

        } catch (error) {

            console.error(
                "Error updating user:",
                error
            );

            alert(
                "Failed to update user."
            );
        }
    };

    // =========================
    // DELETE USER
    // =========================

    const deleteUser = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this user?"
            )
        ) {
            return;
        }

        try {

            const response = await axios.delete(
                `${API_URL}/accounts/delete_User/${id}/`
            );

            if (response.data.success) {

                alert(
                    "User deleted successfully!"
                );

                fetchUsers();
            }

        } catch (error) {

            console.error(
                "Error deleting user:",
                error
            );

            alert(
                "Failed to delete user."
            );
        }
    };

    // =========================
    // GET GROUP ORDER
    // =========================

    const searchGroupOrder = async () => {

        if (!groupCode.trim()) {

            alert(
                "Enter a group code."
            );

            return;
        }

        try {

            const response = await axios.get(
                `${API_URL}/group_order/${groupCode.trim()}/`
            );

            setGroupData(response.data);

        } catch (error) {

            console.error(
                "Error fetching group order:",
                error
            );

            setGroupData(null);

            alert(
                "Group order not found."
            );
        }
    };

    // =========================
    // STYLES
    // =========================

    const styles = {

        container: {
            padding: "25px",
            width: "100%",
            boxSizing: "border-box"
        },

        nav: {
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "30px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "15px"
        },

        navButton: {
            padding: "10px 18px",
            border: "1px solid #ddd",
            background: "#fff",
            borderRadius: "5px",
            cursor: "pointer"
        },

        activeButton: {
            padding: "10px 18px",
            border: "1px solid #333",
            background: "#333",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer"
        },

        form: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "550px",
            marginBottom: "35px"
        },

        input: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxSizing: "border-box"
        },

        button: {
            padding: "10px 15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            background: "#fff",
            cursor: "pointer"
        },

        primaryButton: {
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            background: "#333",
            color: "#fff",
            cursor: "pointer"
        },

        card: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "25px",
            width: "100%",
            padding: "20px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxSizing: "border-box",
            background: "#fff"
        },

        cardSection: {
            flex: "1"
        },

        image: {
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "5px"
        },

        select: {
            padding: "9px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            background: "#fff"
        },

        deleteButton: {
            padding: "9px 13px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            background: "#fff",
            cursor: "pointer"
        }

    };

    // =========================
    // RENDER
    // =========================

    return (

        <div
            className="staff-delivery-container"
            style={styles.container}
        >

            {/* ========================= */}
            {/* NAVIGATION */}
            {/* ========================= */}

            <div style={styles.nav}>

                <button
                    style={
                        section === "menu"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() =>
                        setSection("menu")
                    }
                >
                    Menu
                </button>

                <button
                    style={
                        section === "orders"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() =>
                        setSection("orders")
                    }
                >
                    Orders
                </button>

                <button
                    style={
                        section === "payments"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() =>
                        setSection("payments")
                    }
                >
                    Payments
                </button>

                <button
                    style={
                        section === "deliveries"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() =>
                        setSection("deliveries")
                    }
                >
                    Deliveries
                </button>

                <button
                    style={
                        section === "users"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() =>
                        setSection("users")
                    }
                >
                    Users
                </button>

                <button
                    style={
                        section === "groups"
                            ? styles.activeButton
                            : styles.navButton
                    }
                    onClick={() =>
                        setSection("groups")
                    }
                >
                    Group Orders
                </button>

            </div>


            {/* ========================= */}
            {/* MENU */}
            {/* ========================= */}

            {section === "menu" && (

                <div>

                    <h1>
                        {editingMenu
                            ? "Edit Menu"
                            : "Add Menu"}
                    </h1>

                    <form
                        onSubmit={saveMenu}
                        style={styles.form}
                    >

                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Menu Name"
                            value={menuName}
                            onChange={(e) =>
                                setMenuName(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <select
                            style={styles.input}
                            value={category}
                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            <option value="Starter">
                                Starter
                            </option>

                            <option value="Main Course">
                                Main Course
                            </option>

                            <option value="Dessert">
                                Dessert
                            </option>

                            <option value="Beverage">
                                Beverage
                            </option>

                        </select>

                        <input
                            style={styles.input}
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <textarea
                            style={{
                                ...styles.input,
                                minHeight: "90px"
                            }}
                            placeholder="Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={isAvailable}
                                onChange={(e) =>
                                    setIsAvailable(
                                        e.target.checked
                                    )
                                }
                            />

                            {" "}Available
                        </label>

                        <input
                            id="menu-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImage(
                                    e.target.files[0]
                                )
                            }
                        />

                        <div>

                            <button
                                type="submit"
                                style={
                                    styles.primaryButton
                                }
                            >
                                {editingMenu
                                    ? "Update Menu"
                                    : "Add Menu"}
                            </button>

                            {editingMenu && (

                                <button
                                    type="button"
                                    style={{
                                        ...styles.button,
                                        marginLeft: "10px"
                                    }}
                                    onClick={
                                        clearMenuForm
                                    }
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>


                    <h1>
                        Menu List
                    </h1>

                    {loading ? (

                        <h3>
                            Loading menu...
                        </h3>

                    ) : menu.length === 0 ? (

                        <p>
                            No menu items found.
                        </p>

                    ) : (

                        menu.map((item) => (

                            <div
                                className="delivery-card"
                                key={item.id}
                                style={styles.card}
                            >

                                {item.image && (

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={styles.image}
                                    />

                                )}

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        <strong>
                                            Category:
                                        </strong>{" "}
                                        {item.category}
                                    </p>

                                </div>

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <p>
                                        <strong>
                                            Price:
                                        </strong>{" "}
                                        ₹{item.price}
                                    </p>

                                    <p>
                                        {item.description}
                                    </p>

                                </div>

                                <div>

                                    <p>
                                        <strong>
                                            Available:
                                        </strong>{" "}
                                        {item.is_available
                                            ? "Yes"
                                            : "No"}
                                    </p>

                                    <button
                                        style={
                                            styles.button
                                        }
                                        onClick={() =>
                                            editMenu(item)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        style={{
                                            ...styles.deleteButton,
                                            marginLeft: "8px"
                                        }}
                                        onClick={() =>
                                            deleteMenu(
                                                item.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}


            {/* ========================= */}
            {/* ORDERS */}
            {/* ========================= */}

            {section === "orders" && (

                <div>

                    <h1>
                        Order Management
                    </h1>

                    {loading ? (

                        <h3>
                            Loading orders...
                        </h3>

                    ) : orders.length === 0 ? (

                        <p>
                            No orders found.
                        </p>

                    ) : (

                        orders.map((order) => (

                            <div
                                className="delivery-card"
                                key={order.id}
                                style={styles.card}
                            >

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <h3>
                                        Order #{order.id}
                                    </h3>

                                    <p>
                                        <strong>
                                            User:
                                        </strong>{" "}
                                        {order.user}
                                    </p>

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}
                                        {order.address}
                                    </p>

                                </div>

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <p>
                                        <strong>
                                            Total:
                                        </strong>{" "}
                                        ₹{order.total_price}
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {order.status}
                                    </p>

                                </div>

                                <div>

                                    <select
                                        style={
                                            styles.select
                                        }
                                        value={
                                            order.status ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            updateOrder(
                                                order.id,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select Status
                                        </option>

                                        <option value="Preparing">
                                            Preparing
                                        </option>

                                        <option value="Confirmed">
                                            Confirmed
                                        </option>

                                        <option value="Out for Delivery">
                                            Out for Delivery
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>

                                    </select>

                                    <button
                                        style={{
                                            ...styles.deleteButton,
                                            marginLeft: "8px"
                                        }}
                                        onClick={() =>
                                            deleteOrder(
                                                order.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}


            {/* ========================= */}
            {/* PAYMENTS */}
            {/* ========================= */}

            {section === "payments" && (

                <div>

                    <h1>
                        Payment Management
                    </h1>

                    {loading ? (

                        <h3>
                            Loading payments...
                        </h3>

                    ) : payments.length === 0 ? (

                        <p>
                            No payments found.
                        </p>

                    ) : (

                        payments.map((payment) => (

                            <div
                                className="delivery-card"
                                key={payment.id}
                                style={styles.card}
                            >

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <h3>
                                        Payment #{payment.id}
                                    </h3>

                                    <p>
                                        <strong>
                                            Order:
                                        </strong>{" "}
                                        {payment.order}
                                    </p>

                                </div>

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <p>
                                        <strong>
                                            Method:
                                        </strong>{" "}
                                        {payment.payment_method}
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {payment.payment_status}
                                    </p>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}


            {/* ========================= */}
            {/* DELIVERIES */}
            {/* ========================= */}

            {section === "deliveries" && (

                <div>

                    <h1>
                        Delivery Management
                    </h1>

                    {loading ? (

                        <h3>
                            Loading deliveries...
                        </h3>

                    ) : deliveries.length === 0 ? (

                        <p>
                            No deliveries found.
                        </p>

                    ) : (

                        deliveries.map((delivery) => (

                            <div
                                className="delivery-card"
                                key={delivery.id}
                                style={styles.card}
                            >

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <h3>
                                        Order #{delivery.order}
                                    </h3>

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}
                                        {
                                            delivery.delivery_address
                                        }
                                    </p>

                                </div>

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <p>
                                        <strong>
                                            Delivery Person:
                                        </strong>{" "}
                                        {
                                            delivery.delivery_person_name
                                        }
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {
                                            delivery.delivery_status
                                        }
                                    </p>

                                </div>

                                <select
                                    style={
                                        styles.select
                                    }
                                    value={
                                        delivery.delivery_status
                                    }
                                    onChange={(e) =>
                                        updateDelivery(
                                            delivery.id,
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="Preparing">
                                        Preparing
                                    </option>

                                    <option value="Out for Delivery">
                                        Out for Delivery
                                    </option>

                                    <option value="Delivered">
                                        Delivered
                                    </option>

                                </select>

                            </div>

                        ))

                    )}

                </div>

            )}


            {/* ========================= */}
            {/* USERS */}
            {/* ========================= */}

            {section === "users" && (

                <div>

                    <h1>
                        User Management
                    </h1>

                    {loading ? (

                        <h3>
                            Loading users...
                        </h3>

                    ) : users.length === 0 ? (

                        <p>
                            No users found.
                        </p>

                    ) : (

                        users.map((user) => (

                            <div
                                className="delivery-card"
                                key={user.id}
                                style={styles.card}
                            >

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <h3>
                                        {user.username}
                                    </h3>

                                    <p>
                                        <strong>
                                            Email:
                                        </strong>{" "}
                                        {user.email}
                                    </p>

                                </div>

                                <div
                                    style={
                                        styles.cardSection
                                    }
                                >

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}
                                        {user.address ||
                                            "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            Role:
                                        </strong>{" "}
                                        {user.status}
                                    </p>

                                </div>

                                <div>

                                    <select
                                        style={
                                            styles.select
                                        }
                                        value={
                                            user.status ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            updateUser(
                                                user.id,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Customer">
                                            Customer
                                        </option>

                                        <option value="Staff">
                                            Staff
                                        </option>

                                        <option value="Admin">
                                            Admin
                                        </option>

                                    </select>

                                    <button
                                        style={{
                                            ...styles.deleteButton,
                                            marginLeft: "8px"
                                        }}
                                        onClick={() =>
                                            deleteUser(
                                                user.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}


            {/* ========================= */}
            {/* GROUP ORDERS */}
            {/* ========================= */}

            {section === "groups" && (

                <div>

                    <h1>
                        Group Order Management
                    </h1>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            maxWidth: "500px",
                            marginBottom: "30px"
                        }}
                    >

                        <input
                            style={{
                                ...styles.input,
                                flex: 1
                            }}
                            type="text"
                            placeholder="Enter Group Code"
                            value={groupCode}
                            onChange={(e) =>
                                setGroupCode(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            style={
                                styles.primaryButton
                            }
                            onClick={
                                searchGroupOrder
                            }
                        >
                            Search
                        </button>

                    </div>


                    {groupData && (

                        <div
                            style={styles.card}
                        >

                            <div
                                style={
                                    styles.cardSection
                                }
                            >

                                <h3>
                                    Group Order
                                </h3>

                                <p>
                                    <strong>
                                        Group Code:
                                    </strong>{" "}
                                    {
                                        groupData.group_code
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Creator:
                                    </strong>{" "}
                                    {
                                        groupData.created_by_username ||
                                        groupData.created_by
                                    }
                                </p>

                            </div>

                            <div
                                style={
                                    styles.cardSection
                                }
                            >

                                <p>
                                    <strong>
                                        Budget:
                                    </strong>{" "}
                                    {groupData.budget
                                        ? `₹${groupData.budget}`
                                        : "No budget"}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {groupData.status}
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}

export default StaffDelivery;