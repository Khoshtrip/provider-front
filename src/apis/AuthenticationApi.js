import api from "../utils/api"; // Assuming your configuration file is named api.js

export const AuthenticationApi = {
    sendVerificationCode: async (contactValue) => {
        try {
            const response = await api.post("/auth/send-verification-code/", {
                contact_value: contactValue,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    verifyCode: async (contactValue, code) => {
        try {
            const response = await api.post("/auth/verify-code/", {
                contact_value: contactValue,
                code,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    login: async (contactValue, password) => {
        try {
            const response = await api.post("/auth/login/", {
                contact_value: contactValue,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    fetchUser: async () => {
        try {
            const response = await api.get("/user");
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    logout: async (refreshToken) => {
        try {
            const response = await api.post("/auth/logout/", {
                refresh: refreshToken,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    refreshToken: async (refreshToken) => {
        try {
            const response = await api.post("/auth/token/refresh/", {
                refresh: refreshToken,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};
