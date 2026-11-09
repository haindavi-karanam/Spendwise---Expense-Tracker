
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";
import "./ReceiptScanner.css";

function formatReceiptDate(date) {
    if (!date) return "";

    const parts = date.split(/[/-]/);

    if (parts.length !== 3) return "";

    const [day, month, rawYear] = parts;

    const year =
        rawYear.length === 2
            ? `20${rawYear}`
            : rawYear;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function ReceiptScanner() {
    const { logout } = useAuth();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [result, setResult] = useState(null);

    // Editable receipt information
    const [expenseData, setExpenseData] = useState({
        title: "",
        amount: "",
        category: "Other",
        date: ""
    });

    // Handle receipt image selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
            setError("Please upload a JPG or PNG image.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));

        setResult(null);
        setError("");
        setSuccess("");

        setExpenseData({
            title: "",
            amount: "",
            category: "Other",
            date: ""
        });
    };

    // Send receipt to backend for OCR scanning
    const handleScan = async () => {
        if (!file) {
            setError("Please select a receipt image first.");
            return;
        }

        const formData = new FormData();
        formData.append("receipt", file);

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.post(
                "/receipts/scan",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const receipt = response.data.receiptData;

            setResult(response.data);

            setExpenseData({
                title: receipt.storeName || "",
                amount: receipt.amount ?? "",
                category: "Other",
                date: formatReceiptDate(receipt.date)
            });

        } catch (error) {
            console.error("Receipt scanning failed:", error);

            setError(
                error.response?.data?.message ||
                "Unable to scan receipt. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle changes to editable fields
    const handleChange = (e) => {
        const { name, value } = e.target;

        setExpenseData((current) => ({
            ...current,
            [name]: value
        }));
    };

    // Save corrected receipt information as an expense
    const handleSaveExpense = async (e) => {
        e.preventDefault();

        const amount = Number(expenseData.amount);

        if (!expenseData.title.trim()) {
            setError("Please enter the store name or expense title.");
            return;
        }

        if (!expenseData.amount || !Number.isFinite(amount) || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        if (!expenseData.category.trim()) {
            setError("Please enter a category.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                title: expenseData.title.trim(),
                amount,
                type: "expense",
                category: expenseData.category.trim()
            };

            if (expenseData.date) {
                payload.date = expenseData.date;
            }

            await api.post("/expense", payload);

            setSuccess("Expense saved successfully!");

        } catch (error) {
            console.error("Saving expense failed:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save expense. Please try again."
            );
        } finally {
            setSaving(false);
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

                    <Link to="/transactions" className="nav-item">
                        💳 Transactions
                    </Link>

                    <Link
                        to="/receipt-scanner"
                        className="nav-item active"
                    >
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
                        <h1>Receipt Scanner</h1>
                        <p>
                            Upload your receipt and automatically
                            extract expense details.
                        </p>
                    </div>
                </header>

                <section className="receipt-container">

                    <h2>Upload Receipt</h2>

                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                    />

                    {/* Receipt preview */}
                    {preview && (
                        <div className="receipt-preview">
                            <img
                                src={preview}
                                alt="Uploaded receipt"
                            />
                        </div>
                    )}

                    <button
                        className="add-expense-btn"
                        onClick={handleScan}
                        disabled={!file || loading}
                    >
                        {loading ? "Scanning Receipt..." : "Scan Receipt"}
                    </button>

                    {/* Error message */}
                    {error && (
                        <p className="receipt-error">
                            {error}
                        </p>
                    )}

                    {/* Success message */}
                    {success && (
                        <p className="receipt-success">
                            {success}
                        </p>
                    )}

                    {/* Extracted receipt information */}
                    {result && (
                        <div className="receipt-result">

                            <h2>Review Expense Details</h2>

                            <p>
                                OCR has extracted the following
                                information. You can edit any field
                                before saving.
                            </p>

                            <form onSubmit={handleSaveExpense}>

                                <div className="receipt-form-group">
                                    <label>Store Name / Title</label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={expenseData.title}
                                        onChange={handleChange}
                                        placeholder="Enter store name"
                                        required
                                    />
                                </div>

                                <div className="receipt-form-group">
                                    <label>Amount (₹)</label>

                                    <input
                                        type="number"
                                        name="amount"
                                        value={expenseData.amount}
                                        onChange={handleChange}
                                        placeholder="Enter amount"
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="receipt-form-group">
                                    <label>Category</label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={expenseData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Food, Shopping"
                                        required
                                    />
                                </div>

                                <div className="receipt-form-group">
                                    <label>Date</label>

                                    <input
                                        type="date"
                                        name="date"
                                        value={expenseData.date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="add-expense-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving Expense..."
                                        : "Save as Expense"}
                                </button>

                            </form>

                            {/* Original OCR output */}
                            <div className="ocr-text-section">
                                <h3>Original Extracted Text</h3>

                                <pre>
                                    {result.extractedText}
                                </pre>
                            </div>

                        </div>
                    )}

                </section>
            </main>
        </div>
    );
}

export default ReceiptScanner;
