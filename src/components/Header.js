import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "./Login";
import "../styles/Header.css";

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [showLoginSignup, setShowLoginSignup] = React.useState(false);

    return (
        <header className="header">
            <div className="logo">
                <Link>KhoshTrip</Link>
            </div>
            <nav>{/* Add navigation items here */}</nav>
            <div className="auth-section">
                {isAuthenticated ? (
                    <button
                        className="profile-button"
                        onClick={() => {
                            /* Navigate to profile page */
                        }}
                    >
                        {user.firstName}
                    </button>
                ) : (
                    <button
                        className="login-button"
                        onClick={() => setShowLoginSignup(true)}
                    >
                        Login
                    </button>
                )}
            </div>
            {showLoginSignup && (
                <Login onClose={() => setShowLoginSignup(false)} />
            )}
        </header>
    );
};

export default Header;
