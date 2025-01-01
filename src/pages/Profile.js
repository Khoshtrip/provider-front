import React, { useContext } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <Container style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>Loading...</h2>
            </Container>
        );
    }

    const {
        email,
        phoneNumber,
        firstName,
        lastName,
        nationalId,
        dateJoined,
        role,
        businessName,
        businessAddress,
        businessPhone,
        businessWebsite,
    } = user;

    return (
        <Container style={{ marginTop: "30px", maxWidth: "800px" }}>
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                }}
            >
                <Card.Header
                    style={{
                        textAlign: "center",
                        fontSize: "1.5rem",
                    }}
                >
                    Profile Information
                </Card.Header>
                <Card.Body>
                    <Table hover responsive style={{ marginTop: "10px" }}>
                        <tbody>
                            <tr>
                                <td
                                    style={{ fontWeight: "bold", width: "35%" }}
                                >
                                    Email
                                </td>
                                <td>{email}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>
                                    Phone Number
                                </td>
                                <td>{phoneNumber}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>
                                    National ID
                                </td>
                                <td>{nationalId}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>
                                    Date Joined
                                </td>
                                <td>
                                    {new Date(dateJoined).toLocaleDateString()}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>
                                    Business Name
                                </td>
                                <td>{businessName || "N/A"}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>
                                    Business Address
                                </td>
                                <td>{businessAddress || "N/A"}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>
                                    Business Phone
                                </td>
                                <td>{businessPhone || "N/A"}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: "bold" }}>Website</td>
                                <td>
                                    {businessWebsite ? (
                                        <a
                                            href={businessWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {businessWebsite}
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
