
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transaction.jsx";
import ReceiptScanner from "./pages/ReceiptScanner.jsx";
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    return user ? children : <Navigate to="/login" replace />;
}

function App() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={user ? "/dashboard" : "/login"}
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" /> : <Login />}
            />

            <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" /> : <Register />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <Transactions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/receipt-scanner"
                element={
                    <ProtectedRoute>
                        <ReceiptScanner />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
