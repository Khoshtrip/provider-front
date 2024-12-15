import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [showLoginSignup, setShowLoginSignup] = React.useState(false);
    const navigate = useNavigate();

    return (
        <>
            <Navbar expand="sm">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        KhoshTrip
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto">
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => {
                                            navigate("/profile");
                                        }}
                                    >
                                        Profile
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            navigate("/");
                                            logout();
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={() => setShowLoginSignup(true)}
                                >
                                    Login
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* {showLoginSignup && (
                <Login onClose={() => setShowLoginSignup(false)} />
            )} */}
            <Login
                show={showLoginSignup}
                onHide={() => {
                    setShowLoginSignup(false);
                }}
            />
        </>
    );
};

export default Header;
