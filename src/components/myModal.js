import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import { Modal } from "react-bootstrap";

const myModal = ({ show, title, onHide }) => {

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Modal content</p>
                {/* <Login /> */}
            </Modal.Body>
        </Modal>
    );
}

export default myModal;