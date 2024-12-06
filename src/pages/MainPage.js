import React from "react";
import "../styles/MainPage.css";

const MainPage = () => {
    return (
        <div className="main-page">
            <h1>Welcome to KhoshTrip</h1>
            <p>Plan your next adventure with ease!</p>
            <div className="featured-trips">
                <h2>Featured Trips</h2>
                <div className="trip-list">{/* Add featured trips here */}</div>
            </div>
        </div>
    );
};

export default MainPage;
