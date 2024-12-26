import React, { useState, useEffect } from "react";
import "../../styles/core/Login.css";
import {
    Form,
    Modal,
    Button,
    Col,
    Row,
    Alert,
    Carousel,
    Image,
} from "react-bootstrap";
import { ProductCardFixture } from "./ProcuctCard";

// export const ProductCardFixture = {
//     id: 1,
//     name: "Product 1",
//     description: "Product 1 description",
//     price: 100,
//     image: [
//         "https://via.placeholder.com/150",
//         "https://via.placeholder.com/180",
//     ],
//     summary: "Product 1 summary",
//     stock: 10,
//     category: "Category 1",
//     rating: 4.5,
//     discount: 33,
//     status: "active",
// };

const ImageCarousels = ({ images }) => {
    return (
        <Carousel data-bs-theme="dark" className="mb-3 mt-3">
            {images.map((image, index) => (
                <Carousel.Item
                    key={index}
                    className="justify-content-center"
                    style={{ height: "300px", textAlign: "center" }}
                >
                    <Image
                        src={image}
                        alt={image || "ax"}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            minHeight: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

const ProductModalModes = {
    EDIT: "edit",
    VIEW: "view",
};

const ProductDetailModal = ({ show, onHide, productId }) => {
    const [alert, setAlert] = useState({});
    const [backupData, setBackupData] = useState({});
    const [viewMode, setViewMode] = useState(ProductModalModes.VIEW);
    const [productData, setProductData] = useState(ProductCardFixture);
    const [touch, setTouch] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Get product details.
    }, []);
    const onDeleteProduct = async (productId) => {};

    const handleChange = (e) => {
        const value = e.target.value.replace(/[۰-۹]/g, (d) =>
            "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
        );
        setProductData({ ...productData, [e.target.name]: value });
        validateField(e.target.name, value);
        setTouch({ ...touch, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { selectedImages } = productData;
        if (selectedImages && selectedImages.length > 0) {
            const formData = new FormData();
            selectedImages.forEach((image) => {
                formData.append("file", image);
            });
            //Upload
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
            case "price":
                newErrors.password = isNaN(value)
                    ? "Price must be a number"
                    : value < 0 ||
                      value > 1000000 ||
                      value === "" ||
                      value === null
                    ? "Price must be between 0 and 1000000"
                    : "";
                break;
            case "discount":
                newErrors.discount = isNaN(value)
                    ? "Discount must be a number"
                    : value < 0 || value > 100 || value === "" || value === null
                    ? "Discount must be between 0 and 100"
                    : "";
                break;

            case "selectedImages":
                const files = Array.from(value);
                const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                const validFiles = files.filter((file) =>
                    allowedTypes.includes(file.type)
                );
                if (validFiles.length !== files.length) {
                    newErrors.selectedImages =
                        "Only .png and .jpg files are allowed.";
                } else {
                    newErrors.selectedImages = "";
                    setProductData((prev) => ({
                        ...prev,
                        selectedImages: validFiles,
                    }));
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const resetState = () => {
        setErrors({});
        setAlert({});
        setTouch({});
        setViewMode(ProductModalModes.VIEW);
    };

    const onClose = () => {
        onHide();
        resetState();
    };

    return (
        <Modal show={show} onHide={onClose} fullscreen="md-down" centered>
            <Modal.Header closeButton>
                <Modal.Title>Product Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ImageCarousels images={productData.images} />
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="Name" as={Row}>
                        <Form.Label column sm="2">
                            Name
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === ProductModalModes.VIEW}
                                readOnly={viewMode === ProductModalModes.VIEW}
                                type="text"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="Description" as={Row}>
                        <Form.Label column sm="2">
                            Description
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === ProductModalModes.VIEW}
                                readOnly={viewMode === ProductModalModes.VIEW}
                                type="text"
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="Price" as={Row}>
                        <Form.Label column sm="2">
                            Price
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === ProductModalModes.VIEW}
                                readOnly={viewMode === ProductModalModes.VIEW}
                                type="text"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                isValid={touch.price && !errors.price}
                                isInvalid={!!errors.price}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.price}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="Discount" as={Row}>
                        <Form.Label column sm="2">
                            Discount
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === ProductModalModes.VIEW}
                                readOnly={viewMode === ProductModalModes.VIEW}
                                type="text"
                                name="discount"
                                value={productData.discount}
                                onChange={handleChange}
                                isValid={touch.discount && !errors.discount}
                                isInvalid={!!errors.discount}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.discount}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="Category" as={Row}>
                        <Form.Label column sm="2">
                            Category
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === ProductModalModes.VIEW}
                                readOnly={viewMode === ProductModalModes.VIEW}
                                type="text"
                                name="category"
                                value={productData.category}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="Summary" as={Row}>
                        <Form.Label column sm="2">
                            Summary
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === ProductModalModes.VIEW}
                                readOnly={viewMode === ProductModalModes.VIEW}
                                as="textarea"
                                rows={3}
                                name="summary"
                                value={productData.summary}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    {viewMode === ProductModalModes.EDIT && (
                        <Form.Group controlId="SelectedImages" as={Row}>
                            <Form.Label column sm="2">
                                Select Photos
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="file"
                                    name="selectedImages"
                                    value={productData.selectedImages}
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleChange}
                                    multiple
                                    isValid={
                                        touch.selectedImages &&
                                        !errors.selectedImages
                                    }
                                    isInvalid={!!errors.selectedImages}
                                />
                            </Col>
                            <Form.Control.Feedback type="invalid">
                                {errors.selectedImages}
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}

                    {/* {alert.shouldShow && (
                        <Alert show={alert.shouldShow} variant={alert.variant}>
                            {alert.message}
                        </Alert>
                    )} */}
                </Form>

                <Modal.Footer as={Row}>
                    {viewMode === ProductModalModes.EDIT ? (
                        <>
                            <Button variant="outline-success" type="submit">
                                Save
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => {
                                    onClose();
                                    setProductData(backupData);
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="outline-danger"
                                onClick={() => {
                                    onDeleteProduct(productData.id);
                                }}
                            >
                                Delete Product
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setViewMode(ProductModalModes.EDIT);
                                setBackupData(productData);
                            }}
                        >
                            Edit
                        </Button>
                    )}
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
};

export default ProductDetailModal;
