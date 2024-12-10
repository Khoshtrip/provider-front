import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import Input from "./shared/Input";
import { Form, Modal, InputGroup, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = ({ show, onClose }) => {
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
    const [touch, setTouch] = useState({});
    const [errors, setErrors] = useState({});
    const { login, signup } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        validateField(e.target.name, e.target.value);
        setTouch({ ...touch, [e.target.name]: true });
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
        <Modal
            show={show}
            onHide={onClose}
            fullscreen="md-down"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{isLogin ? "Login" : "Sign Up"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <Form.Group controlId="Username">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    aria-describedby="inputGroupPrepend"
                                    value={formData.username}
                                    onChange={handleChange}
                                    isValid={touch.username && !errors.username}
                                    isInvalid={!!errors.username}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.username}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        
                        <Form.Group controlId="Password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isValid={touch.password && !errors.password}
                                isInvalid={!!errors.password}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="PasswordRepeat">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Repeat Password"
                                name="passwordRepeat"
                                value={formData.passwordRepeat}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Form.Group as={Col} controlId="FirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="LastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group controlId="PhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="NationalCode">
                            <Form.Label>National Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="National Code"
                                name="nationalCode"
                                value={formData.nationalCode}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="Email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isValid={touch.email && !errors.email}
                                isInvalid={!!errors.email}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </>
                )}

                {isLogin && (
                    <>
                        <Form.Group controlId="Username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="Password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <div className="login-options">
                            <Form.Group controlId="RememberMe">
                                <Form.Check
                                    type="checkbox"
                                    label="Remember Me"
                                    name="rememberMe"
                                />
                            </Form.Group>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </>
                )}

                <Button variant="primary" type="submit">
                    {isLogin ? "Login" : "Sign Up"}
                </Button>
            </Form>
            <p>
                {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                <Button
                    variant="primary"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Sign Up" : "Login"}
                </Button>
            </p>
            </Modal.Body>
        </Modal> 
               
    );
};

export default Login;
