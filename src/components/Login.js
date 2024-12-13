import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import { Form, Modal, Button, Col, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthenticationApi } from "../apis/AuthenticationApi";

const LoginState = {
    LOGIN: "login",
    SIGNUP: "signup",
    VERIFICATION_CODE: "verification_code",
    VERIFICATION_CONTACT: "verification_contact",
};

const Login = ({ show, onHide }) => {
    const [loginState, setLoginState] = useState(LoginState.LOGIN);
    const { login, signup, loading } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        password: "",
        mobile_number: "",
        nationalCode: "",
        email: "",
        firstName: "",
        lastName: "",
        passwordRepeat: "",
        verifyCode: "",
        verified_contact: "email",
    });
    
    const [touch, setTouch] = useState({});
    const [errors, setErrors] = useState({});
    const [timer, setTimer] = useState(120);
    const [isCounting, setIsCounting] = useState(false);

    const startTimer = () => {
        setIsCounting(true);
        setTimer(120);
    };

    useEffect(() => {
        let interval;
        if (isCounting) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsCounting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCounting]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        validateField(e.target.name, e.target.value);
        setTouch({ ...touch, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        switch (loginState) {
            case LoginState.LOGIN:
                await login(formData.mobile_number, formData.password)
                    .then(onClose)
                    .catch(() => {
                        let newErrors = { ...errors };
                        newErrors.mobile_number = "Invalid username or password";
                        newErrors.password = "Invalid username or password";
                        setErrors(newErrors);
                    });
                break;
            case LoginState.SIGNUP:
                await signup(formData)
                    .then()
                    .catch(() => {
                        let newErrors = { ...errors };
                        newErrors.mobile_number = "Invalid username or password";
                        newErrors.password = "Invalid username or password";
                        setErrors(newErrors);
                    });
                break;
            case LoginState.VERIFICATION_CONTACT:
                if (errors.mobile_number === "") {
                    await AuthenticationApi.sendVerificationCode(formData.mobile_number)
                        .then(() => {
                            startTimer();
                            setLoginState(LoginState.VERIFICATION_CODE);
                        })
                        .catch(() => {});
                } else {
                }
                break;
            case LoginState.VERIFICATION_CODE:
                await AuthenticationApi.verifyCode(
                    formData.email,
                    formData.code
                )
                    .then(onClose)
                    .catch(() => {
                        let newErrors = { ...errors };
                        newErrors.code = "Invalid code";
                        setErrors(newErrors);
                    });
                break;
            default:
                break;
        }
    };

    const validateField = (fieldName, value) => {
        let newErrors = { ...errors };
        switch (fieldName) {
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
            default:
                break;
        }
        setErrors(newErrors);
    };

    const resetState = () => {
        setErrors({});
        setFormData({
            password: "",
            mobile_number: "",
            nationalCode: "",
            email: "",
            firstName: "",
            lastName: "",
            passwordRepeat: "",
            verifyCode: "",
            verified_contact: "email",
        });
        setTouch({});
    };

    const onClose = () => {
        onHide();
        resetState();
        setLoginState(LoginState.LOGIN);
    };

    const resendCode = () => {
        AuthenticationApi.sendVerificationCode(formData.email)
            .then(() => {
                startTimer();
            })
            .catch(() => {});
    }

    return (
        <Modal show={show} onHide={onClose} fullscreen="md-down" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {loginState === LoginState.LOGIN ? "Login" : "Sign Up"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {loginState === LoginState.VERIFICATION_CONTACT && (
                        <>
                            <Form.Group controlId="PhoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Phone Number"
                                    name="mobile_number"
                                    value={formData.mobile_number}
                                    isValid={touch.mobile_number && !errors.mobile_number}
                                    isInvalid={!!errors.mobile_number}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.mobile_number}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>

                        
                    )}

                    {loginState === LoginState.VERIFICATION_CODE && (
                        <>
                            <Form.Group controlId="Code">
                                <Form.Label>
                                    Enter the code sent to you
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    isValid={touch.code && !errors.code}
                                    isInvalid={!!errors.code}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.code}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <p className="mb-0">
                                {isCounting ? (
                                    <span>
                                        Resend code in <strong>{timer}</strong> seconds
                                    </span>
                                ) : (
                                    "Didn't receive the code?"
                                )}
                            </p>
                            {!isCounting && (
                                <Stack direction="horizontal" className="col-md-8 mx-auto">
                                    <Button variant="secondary" onClick={resendCode}>Resend Code</Button>
                                    <Button variant="secondary" onClick={() => {setLoginState(LoginState.VERIFICATION_CONTACT)}} className="ms-auto">Change Phone Number</Button>
                                </Stack>
                            )}
                        </>
                    )}

                    {loginState === LoginState.LOGIN && (
                        <>
                            <Form.Group controlId="PhoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Phone Number"
                                    name="mobile_number"
                                    value={formData.mobile_number}
                                    isValid={touch.mobile_number && !errors.mobile_number}
                                    isInvalid={!!errors.mobile_number}
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
                                    isValid={touch.password && !errors.password}
                                    isInvalid={!!errors.password}
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
                                <Link to="/forgot-password" onClick={onClose}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </>
                    )}

                    {loginState === LoginState.SIGNUP && (
                        <>
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

                        </>
                    )}

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading
                            ? "..."
                            : loginState === LoginState.LOGIN
                            ? "Login"
                            : "Next"}
                    </Button>
                </Form>

                <p className="modal_footer">
                    {loginState === LoginState.LOGIN
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <Link
                        onClick={() => {
                            resetState();
                            setLoginState(
                                loginState === LoginState.LOGIN
                                    ? LoginState.VERIFICATION_CONTACT
                                    : LoginState.LOGIN
                            );
                        }}
                    >
                        {loginState === LoginState.LOGIN ? "Sign Up" : "Login"}
                    </Link>
                </p>
            </Modal.Body>
        </Modal>
    );
};

export default Login;
