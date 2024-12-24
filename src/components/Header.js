import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const AuthenticationButtons = ({ isAuthenticated, setShowLoginSignup }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    return isAuthenticated ? (
        <>
            <Button
                variant="outline-primary"
                className="me-2 on-primary border-on-primary"
                onClick={() => {
                    navigate("/profile");
                }}
            >
                Profile
            </Button>
            <Button
                variant="primary"
                className="on-primary border-on-primary"
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
            variant="outline-primary"
            onClick={() => setShowLoginSignup(true)}
            className="on-primary border-on-primary"
        >
            Login
        </Button>
    );
};

const Header = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [showLoginSignup, setShowLoginSignup] = React.useState(false);

    return (
        <>
            <Navbar expand="sm" className="bg-primary on-primary">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="on-primary">
                        KhoshTrip
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="me-auto my-2 my-lg-0">
                            <Nav.Link href="/" className="on-primary">
                                Home
                            </Nav.Link>
                            <Nav.Link href="/products" className="on-primary">
                                Products
                            </Nav.Link>
                        </Nav>
                        <AuthenticationButtons
                            isAuthenticated={isAuthenticated}
                            setShowLoginSignup={setShowLoginSignup}
                        />
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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
