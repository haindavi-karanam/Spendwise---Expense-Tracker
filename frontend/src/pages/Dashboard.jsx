import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const { user, logout } = useAuth();

    // Store expenses fetched from the backend
    const [expenses, setExpenses] = useState([]);

    // Show loading while fetching data
    const [loading, setLoading] = useState(true);

    // Controls whether the Add Transaction modal is visible
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: ""
    });

    // Fetch expenses when the Dashboard first loads
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                    
        const response = await api.get("/expense");

        console.log("Backend response:", response.data);

        setExpenses(response.data.expense || []);

            } catch (error) {
                console.error("Failed to fetch expenses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);


    const expenseList = Array.isArray(expenses) ? expenses : [];
    // Calculate total income
    const totalIncome = expenseList
        .filter((expense) => expense.type === "income")
        .reduce((total, expense) => total + expense.amount, 0);

    // Calculate total expenses
    const totalExpense = expenseList
        .filter((expense) => expense.type === "expense")
        .reduce((total, expense) => total + expense.amount, 0);

    // Calculate current balance
    const balance = totalIncome - totalExpense;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post("/expense", {
            ...formData,
            amount: Number(formData.amount)
        });

        console.log("Transaction added:", response.data);

        // Add the new transaction to the dashboard immediately
        setExpenses((currentExpenses) => [
            response.data.expense,
            ...currentExpenses
        ]);

        // Close the form
        setShowForm(false);

        // Reset form fields
        setFormData({
            title: "",
            amount: "",
            type: "expense",
            category: "",
            date: ""
        });

    } catch (error) {
        console.error("Failed to add transaction:", error);
    }
};

    return (
        <div className="dashboard-layout">

            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">SpendWise</h2>

                <nav className="nav-links">
                    <Link to="/dashboard" className="nav-item active">
                        📊 Dashboard
                    </Link>

                    <Link to="/transactions" className="nav-item">
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
                        <h1>Welcome back, {user?.name || "User"} 👋</h1>
                        <p>Here's an overview of your finances.</p>
                    </div>

                    <button
                        className="add-expense-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Transaction
                    </button>
                </header>

                {/* Summary cards */}
                <section className="summary-cards">
                    <div className="summary-card">
                        <p>Total Balance</p>
                        <h2>₹{balance.toFixed(2)}</h2>
                    </div>

                    <div className="summary-card">
                        <p>Total Income</p>
                        <h2>₹{totalIncome.toFixed(2)}</h2>
                    </div>

                    <div className="summary-card">
                        <p>Total Expenses</p>
                        <h2>₹{totalExpense.toFixed(2)}</h2>
                    </div>
                </section>

                {/* Recent Transactions */}
                <section className="transactions-section">
                    <div className="section-header">
                        <h2>Recent Transactions</h2>
                    </div>

                    {loading ? (
                        <div className="empty-transactions">
                            <p>Loading transactions...</p>
                        </div>
                    ) : expenseList.length === 0 ? (
                        <div className="empty-transactions">
                            <p>No transactions yet.</p>
                            <span>
                                Add your first transaction to get started!
                            </span>
                        </div>
                    ) : (
                        <div className="transactions-list">
                            {expenseList.slice(0, 5).map((expense) => (
                                <div
                                    className="transaction-item"
                                    key={expense._id}
                                >
                                    <div>
                                        <h3>{expense.title}</h3>
                                        <p>
                                            {expense.category} ·{" "}
                                            {new Date(
                                                expense.date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span
                                        className={
                                            expense.type === "income"
                                                ? "income-amount"
                                                : "expense-amount"
                                        }
                                    >
                                        {expense.type === "income"
                                            ? "+"
                                            : "-"}
                                        ₹{expense.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                {showForm && (
                    <div className="modal-overlay">
                        <div className="transaction-modal">
                            
                            <div className="modal-header">
                                <h2>Add Transaction</h2>

                                <button
                                    className="close-btn"
                                    onClick={() => setShowForm(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Grocery shopping"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="Enter amount"
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
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Food"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="submit-transaction-btn"
                                >
                                    Add Transaction
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
