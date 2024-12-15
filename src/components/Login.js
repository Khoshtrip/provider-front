import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import { Form, Modal, Button, Col, Row, Stack, Alert } from "react-bootstrap";
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
    const [alert, setAlert] = useState({
        shouldShow: false,
        variant: "success",
        message: "successfully signed up!",
    });

    const [formData, setFormData] = useState({
        password: "",
        phone_number: "",
        nationalCode: "",
        email: "",
        firstName: "",
        lastName: "",
        passwordRepeat: "",
        verifyCode: "",
        birthDate: "",
        businessName: "",
        businessAddress: "",
        businessPhone: "",
        businessWebsite: "",
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
        const value = e.target.value.replace(/[۰-۹]/g, (d) =>
            "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
        );
        setFormData({ ...formData, [e.target.name]: value });
        validateField(e.target.name, value);
        setTouch({ ...touch, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        switch (loginState) {
            case LoginState.LOGIN:
                await login(formData.phone_number, formData.password)
                    .then(onClose)
                    .catch(() => {
                        let newErrors = { ...errors };
                        newErrors.phone_number = "Invalid username or password";
                        newErrors.password = "Invalid username or password";
                        setErrors(newErrors);
                    });
                break;
            case LoginState.SIGNUP:
                await signup(formData)
                    .then(() => {
                        setAlert({
                            shouldShow: true,
                            variant: "success",
                            message: "successfully signed up!",
                        });
                        setTimeout(() => {
                            setAlert({
                                shouldShow: false,
                                variant: "success",
                                message: "successfully signed up!",
                            });
                            resetState();
                            setLoginState(LoginState.LOGIN);
                        }, 1500);
                    })
                    .catch(() => {
                        setAlert({
                            shouldShow: true,
                            variant: "danger",
                            message:
                                "This phone number already has an account!",
                        });
                    });

                break;
            case LoginState.VERIFICATION_CONTACT:
                if (errors.phone_number === "") {
                    await AuthenticationApi.sendVerificationCode(
                        formData.phone_number
                    )
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
                    formData.phone_number,
                    formData.code
                )
                    .then(() => {
                        setLoginState(LoginState.SIGNUP);
                    })
                    .catch(() => {
                        let newErrors = { ...errors };
                        newErrors.code = "Invalid code";
                        setErrors(newErrors);
                    });
                //
                break;
            default:
                break;
        }
    };

    function validateNationalCode(nationalCode) {
        if (!/^\d{10}$/.test(nationalCode)) return false;

        const check = parseInt(nationalCode[9]);
        const sum = nationalCode
            .slice(0, 9)
            .split("")
            .reduce(
                (acc, digit, index) => acc + parseInt(digit) * (10 - index),
                0
            );

        const remainder = sum % 11;
        return remainder < 2 ? check === remainder : check === 11 - remainder;
    }

    const validateField = (fieldName, value) => {
        let newErrors = { ...errors };
        switch (fieldName) {
            case "password":
                newErrors.password =
                    value.length < 6
                        ? "Password must be at least 6 characters long"
                        : "";
                break;
            case "passwordRepeat":
                newErrors.passwordRepeat =
                    value !== formData.password ? "Passwords do not match" : "";
                break;
            case "email":
                newErrors.email = !/\S+@\S+\.\S+/.test(value)
                    ? "Email is invalid"
                    : "";
                break;
            case "phone_number":
                newErrors.phone_number = !/^(\+98|0)?9\d{9}$/.test(value) // Matches +989xxxxxxxx or 09xxxxxxxx
                    ? "Phone number is invalid"
                    : "";
                break;
            case "businessPhone":
                newErrors.phone_number = !/^\d{9}$/.test(value)
                    ? "Phone number is invalid"
                    : "";
                break;
            case "nationalCode":
                newErrors.nationalCode = !validateNationalCode(value)
                    ? "National Code is invalid"
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
            phone_number: "",
            nationalCode: "",
            email: "",
            firstName: "",
            lastName: "",
            passwordRepeat: "",
            verifyCode: "",
            birthDate: "",
            businessName: "",
            businessAddress: "",
            businessPhone: "",
            businessWebsite: "",
        });
        setAlert({
            shouldShow: false,
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
    };

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
                                    name="phone_number"
                                    value={formData.phone_number}
                                    isValid={
                                        touch.phone_number &&
                                        !errors.phone_number
                                    }
                                    isInvalid={!!errors.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone_number}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}

                    {loginState === LoginState.VERIFICATION_CODE && (
                        <>
                            <Form.Group controlId="Code">
                                <Form.Label>
                                    Enter the code sent to{" "}
                                    {formData.phone_number}
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
                            <div className="login-options">
                                <>
                                    <p className="mb-0">
                                        {isCounting ? (
                                            <span>
                                                Resend code in {timer} seconds
                                            </span>
                                        ) : (
                                            "Didn't receive the code?"
                                        )}
                                    </p>
                                    {!isCounting && (
                                        <Link onClick={resendCode}>
                                            Resend Code
                                        </Link>
                                    )}
                                </>
                                <Link
                                    onClick={() => {
                                        setLoginState(
                                            LoginState.VERIFICATION_CONTACT
                                        );
                                    }}
                                >
                                    Change Phone Number
                                </Link>
                            </div>
                        </>
                    )}

                    {loginState === LoginState.LOGIN && (
                        <>
                            <Form.Group controlId="PhoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Phone Number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    isValid={
                                        touch.phone_number &&
                                        !errors.phone_number
                                    }
                                    isInvalid={!!errors.phone_number}
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
                                    isValid={
                                        touch.passwordRepeat &&
                                        !errors.passwordRepeat
                                    }
                                    isInvalid={!!errors.passwordRepeat}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.passwordRepeat}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* <Row>
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
                            </Row> */}
                            <Form.Group controlId="BusinessName">
                                <Form.Label>Business Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Business Name"
                                    name="businessName"
                                    value={formData.businessName}
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
                                    isValid={
                                        touch.nationalCode &&
                                        !errors.nationalCode
                                    }
                                    isInvalid={!!errors.nationalCode}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nationalCode}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="BirthDate">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="BusinessAddress">
                                <Form.Label>Business Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="businessAddress"
                                    placeholder="Business Address"
                                    value={formData.businessAddress}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="BusinessPhone">
                                <Form.Label>Business Contact Phone</Form.Label>
                                <Form.Control
                                    type="tell"
                                    name="businessPhone"
                                    placeholder="Business Contact"
                                    value={formData.businessPhone}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="BusinessWebsite">
                                <Form.Label>Business URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="Business Website"
                                    name="businessWebsite"
                                    value={formData.businessWebsite}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            {alert.shouldShow && (
                                <Alert
                                    show={alert.shouldShow}
                                    variant={alert.variant}
                                >
                                    {alert.message}
                                </Alert>
                            )}
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
