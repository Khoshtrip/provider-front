import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/core/Header";
import MainPage from "./pages/MainPage";
import Profile from "./pages/Profile";
import "./styles/global.scss";
import Products from "./pages/Products";
import KhoshAlert from "./components/core/KhoshAlert";

function App() {
    return (
        <div className="App">
            <KhoshAlert />
            <Header />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<Products />} />
            </Routes>
        </div>
    );
}

export default App;
