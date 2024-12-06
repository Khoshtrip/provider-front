import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="profile">
            <h1>Welcome, {user.firstName}!</h1>
            <div className="profile-info">
                <p>
                    <strong>Username:</strong> {user.username}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Phone Number:</strong> {user.phoneNumber}
                </p>
            </div>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
};

export default Profile;
