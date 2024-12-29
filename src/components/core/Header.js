import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
import "../../styles/core/Header.css";

const AuthenticationButtons = ({
    isAuthenticated,
    setShowLoginSignup,
    logout,
}) => {
    const navigate = useNavigate();
    return isAuthenticated ? (
        <>
            <Button
                variant="outline-secondary"
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
            variant="outline-secondary"
            onClick={() => setShowLoginSignup(true)}
        >
            Login
        </Button>
    );
};

const HeaderTabs = ({ isAuthenticated }) => {
    return (
        <>
            <Nav.Link href="/" className="on-primary">
                Home
            </Nav.Link>
            <Nav.Link href="/blog" className="on-primary">
                Blog
            </Nav.Link>
            {isAuthenticated && (
                <>
                    <Nav.Link href="/products" className="on-primary">
                        Products
                    </Nav.Link>
                    <Nav.Link href="/profile" className="on-primary">
                        Profile
                    </Nav.Link>
                </>
            )}
        </>
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
                            <HeaderTabs isAuthenticated={isAuthenticated} />
                        </Nav>
                        <AuthenticationButtons
                            isAuthenticated={isAuthenticated}
                            setShowLoginSignup={setShowLoginSignup}
                            logout={logout}
                        />
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <LoginModal
                show={showLoginSignup}
                onHide={() => {
                    setShowLoginSignup(false);
                }}
            />
        </>
    );
};

export default Header;
