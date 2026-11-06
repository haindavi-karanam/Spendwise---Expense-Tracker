import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                setLoading(true);

                const response = await api.get("/auth/me");

                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password
        });

        return response.data;
    };
    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        setUser(user);

        return user;
    };
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, register, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};