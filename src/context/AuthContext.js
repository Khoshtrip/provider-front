import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { AuthenticationApi } from "../apis/AuthenticationApi";
import { Exception } from "sass";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            fetchUser()
                .then(() => {
                    api.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                })
                .catch(() => {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                });
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await AuthenticationApi.fetchUser();
            console.log(response);
            if (response.role !== "provider") {
                throw new Exception("You are not a provider!");
            }

            setUser({
                email: response.email,
                phoneNumber: response.phone_number,
                firstName: response.first_name,
                lastName: response.last_name,
                nationalId: response.national_id,
                dateJoined: response.date_joined,
                role: response.role,
                businessName: response.business_name,
                businessAddress: response.business_address,
                businessPhone: response.business_phone,
                businessWebsite: response.website_url,
            });
            console.log(response);
            setIsAuthenticated(true);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await AuthenticationApi.login(username, password);
            localStorage.setItem("access", response.access);
            localStorage.setItem("refresh", response.refresh);
            console.log(response);
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.access}`;
            await fetchUser();
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await AuthenticationApi.signup(userData);
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem("refresh");
        const response = await AuthenticationApi.logout(refreshToken).catch(
            () => {}
        );
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
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
