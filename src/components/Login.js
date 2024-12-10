import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import Input from "./shared/Input";

const Login = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        phoneNumber: "",
        nationalCode: "",
        email: "",
        firstName: "",
        lastName: "",
        passwordRepeat: "",
    });
    const [errors, setErrors] = useState({});
    const { login, signup } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        validateField(e.target.name, e.target.value);
    };

    const validateField = (fieldName, value) => {
        let newErrors = { ...errors };
        switch (fieldName) {
            case "username":
                newErrors.username =
                    value.length < 3
                        ? "Username must be at least 3 characters long"
                        : "";
                break;
            case "password":
                newErrors.password =
                    value.length < 6
                        ? "Password must be at least 6 characters long"
                        : "";
                break;
            case "email":
                newErrors.email = !/\S+@\S+\.\S+/.test(value)
                    ? "Email is invalid"
                    : "";
                break;
            // Add more validation cases for other fields
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            await login(formData.username, formData.password);
        } else {
            await signup(formData);
        }
    };

    return (
        <div className="login-signup-overlay" onClick={onClose}>
            <div
                className="login-signup-popup"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <Input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} error={errors.username} />

                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            <Input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="nationalCode"
                                placeholder="National Code"
                                value={formData.nationalCode}
                                onChange={handleChange}
                            />
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <Input
                                type="password"
                                name="passwordRepeat"
                                placeholder="Repeat Password"
                                value={formData.passwordRepeat}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    {isLogin && (
                        <>
                            <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                error={errors.username}
                            />

                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            <div className="login-options">
                                <label>
                                    <Input type="checkbox" name="rememberMe" />{" "}
                                    Remember Me
                                </label>
                                <a href="#forgot-password">Forgot Password?</a>
                            </div>
                        </>
                    )}

                    <button type="submit">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                <p>
                    {isLogin
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
