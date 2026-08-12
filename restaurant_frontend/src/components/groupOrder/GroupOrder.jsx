import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createGroupOrder,
    joinGroupOrder
} from "../../api/groupOrderApi";

import "./GroupOrder.css";

function GroupOrder() {

    const navigate = useNavigate();

    const [groupCode, setGroupCode] = useState("");
    const [budget, setBudget] = useState("");
    const [noBudget, setNoBudget] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");


    const handleCreateGroup = async () => {

        if (!userId) {
            setError("Please login first.");
            return;
        }

        // Check budget
        if (!noBudget) {

            if (!budget || Number(budget) <= 0) {
                setError("Please enter a valid budget.");
                return;
            }

        }

        try {

            setLoading(true);
            setError("");

            const groupBudget = noBudget
                ? null
                : Number(budget);

            const response = await createGroupOrder(
                userId,
                groupBudget
            );

            navigate(
                `/group-order/${response.group_code}`
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to create group."
            );

        } finally {

            setLoading(false);

        }
    };


    const handleJoinGroup = async () => {

        if (!userId) {
            setError("Please login first.");
            return;
        }

        if (!groupCode.trim()) {
            setError("Please enter a group code.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await joinGroupOrder(
                groupCode.trim(),
                userId
            );

            navigate(
                `/group-order/${groupCode.trim().toUpperCase()}`
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.error ||
                "Failed to join group."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="group-order-page">

            <div className="group-order-card">

                <h1>
                    👥 Group Order
                </h1>

                <p className="group-description">
                    Order food together with your friends.
                </p>


                {error && (
                    <div className="group-error">
                        {error}
                    </div>
                )}


                {/* CREATE GROUP */}

                <div className="group-section">

                    <h2>
                        Create a Group
                    </h2>

                    <p>
                        Create a group and share the code
                        with your friends.
                    </p>


                    {/* BUDGET */}

                    <div className="budget-section">

                        <label>
                            💰 Group Budget
                        </label>

                        <input
                            type="number"
                            min="1"
                            placeholder="Enter budget (₹)"
                            value={budget}
                            disabled={noBudget}
                            onChange={(e) =>
                                setBudget(e.target.value)
                            }
                        />


                        <label className="no-budget-option">

                            <input
                                type="checkbox"
                                checked={noBudget}
                                onChange={(e) => {

                                    setNoBudget(
                                        e.target.checked
                                    );

                                    if (e.target.checked) {
                                        setBudget("");
                                    }

                                }}
                            />

                            No Budget Limit

                        </label>

                    </div>


                    <button
                        className="group-create-button"
                        onClick={handleCreateGroup}
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Group"
                        }
                    </button>

                </div>


                <div className="group-divider">
                    <span>
                        OR
                    </span>
                </div>


                {/* JOIN GROUP */}

                <div className="group-section">

                    <h2>
                        Join a Group
                    </h2>

                    <p>
                        Enter the group code shared by
                        your friend.
                    </p>

                    <input
                        type="text"
                        placeholder="Enter group code"
                        value={groupCode}
                        onChange={(e) =>
                            setGroupCode(
                                e.target.value.toUpperCase()
                            )
                        }
                    />

                    <button
                        className="group-join-button"
                        onClick={handleJoinGroup}
                        disabled={loading}
                    >
                        {loading
                            ? "Joining..."
                            : "Join Group"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}

export default GroupOrder;