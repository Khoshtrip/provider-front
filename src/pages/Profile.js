import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="profile">
            <h1>Welcome {user.businessName}!</h1>
            <div className="profile-info">
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Phone Number:</strong> {user.phoneNumber}
                </p>
                <p>
                    <strong>Business Website:</strong> {user.businessWebsite}
                </p>
                <p>
                    <strong>Business Address:</strong> {user.businessAddress}
                </p>
            </div>
        </div>
    );
};

export default Profile;
