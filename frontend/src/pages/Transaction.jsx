
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Transaction.css";

function Transactions() {
    const { logout } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Stores the transaction currently being edited
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: ""
    });

    // Fetch all transactions
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/expense");
            setTransactions(
                Array.isArray(response.data.expense)
                    ? response.data.expense
                    : []
            );
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Could not load transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Delete a transaction
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/expense/${id}`); //deletes from the server

            setTransactions((current) =>
                current.filter((transaction) => transaction._id !== id)
            ); //updates browser screen without manually refreshing
        } catch (error) {
            console.error("Delete error:", error);
            setError("Failed to delete transaction.");
        }
    };

    // Open edit form with existing transaction details
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);

        setFormData({
            title: transaction.title,
            amount: String(transaction.amount),
            type: transaction.type,
            category: transaction.category,
            date: new Date(transaction.date)
                .toISOString()
                .split("T")[0]
        });
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    // Update transaction
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await api.patch(
                `/expense/${editingTransaction._id}`,
                {
                    ...formData,
                    amount: Number(formData.amount)
                }
            );

            setEditingTransaction(null);

            await fetchTransactions();
        } catch (error) {
            console.error("Update error:", error);
            setError("Failed to update transaction.");
        }
    };

    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">SpendWise</h2>

                <nav className="nav-links">
                    <Link to="/dashboard" className="nav-item">
                        📊 Dashboard
                    </Link>

                    <Link
                        to="/transactions"
                        className="nav-item active"
                    >
                        💳 Transactions
                    </Link>

                    <Link to="/receipt-scanner" className="nav-item">
                        🧾 Scan Receipt
                    </Link>
                </nav>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </aside>

            {/* Main content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <h1>Transactions</h1>
                        <p>Manage all your income and expenses.</p>
                    </div>

                    <Link to="/dashboard" className="back-btn">
                        Back to Dashboard
                    </Link>
                </header>

                {error && <p className="transaction-error">{error}</p>}

                <section className="transactions-section">
                    <div className="section-header">
                        <h2>All Transactions</h2>
                        <span>{transactions.length} records</span>
                    </div>

                    {loading ? (
                        <p className="transaction-message">
                            Loading transactions...
                        </p>
                    ) : transactions.length === 0 ? (
                        <p className="transaction-message">
                            No transactions found.
                        </p>
                    ) : (
                        <div className="transaction-table-wrapper">
                            <table className="transaction-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction._id}>
                                            <td>{transaction.title}</td>
                                            <td>{transaction.category}</td>
                                            <td>
                                                {new Date(
                                                    transaction.date
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={
                                                    transaction.type === "income"
                                                        ? "type-income"
                                                        : "type-expense"
                                                }>
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className={
                                                transaction.type === "income"
                                                    ? "income-amount"
                                                    : "expense-amount"
                                            }>
                                                {transaction.type === "income"
                                                    ? "+"
                                                    : "-"}
                                                ₹{Number(transaction.amount).toFixed(2)}
                                            </td>
                                            <td className="action-buttons">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(transaction)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(transaction._id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

           
            {editingTransaction && (
                <div className="modal-overlay">
                    <div className="transaction-modal">
                        <div className="modal-header">
                            <h2>Edit Transaction</h2>

                            <button
                                className="close-btn"
                                onClick={() => setEditingTransaction(null)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-transaction-btn"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transactions;
