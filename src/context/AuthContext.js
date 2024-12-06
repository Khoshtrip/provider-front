import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user");
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await api.post("/login", { username, password });
            localStorage.setItem("token", response.data.token);
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.token}`;
            await fetchUser();
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post("/signup", userData);
            localStorage.setItem("token", response.data.token);
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.token}`;
            await fetchUser();
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, signup, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
