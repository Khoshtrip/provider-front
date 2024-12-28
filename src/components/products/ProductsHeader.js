import React, { useContext, useEffect, useState } from "react";
import {
    Row,
    Col,
    Stack,
    Container,
    Pagination,
    Form,
    Button,
    Collapse,
    InputGroup,
} from "react-bootstrap";

const FilterComponent = ({ showFilters, onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        minPrice: 0,
        maxPrice: 0,
        stockAvailable: true,
        isActive: true,
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        onFilterChange(filters);
    };

    return (
        <>
            <Collapse in={showFilters}>
                <div className="mb-3 w-100">
                    <Form>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Label>Search</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search "
                                    value={filters.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Category "
                                    value={filters.category}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "category",
                                            e.target.value
                                        )
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Label>Min Price</Form.Label>
                                <Form.Range
                                    value={filters.minPrice}
                                    min={0}
                                    max={1000}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "minPrice",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                <Form.Text>{filters.minPrice}</Form.Text>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>Max Price</Form.Label>
                                <Form.Range
                                    value={filters.maxPrice}
                                    min={0}
                                    max={1000}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "maxPrice",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                <Form.Text>{filters.maxPrice}</Form.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Stock Available"
                                    checked={filters.stockAvailable}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "stockAvailable",
                                            e.target.checked
                                        )
                                    }
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Is Active"
                                    checked={filters.isActive}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "isActive",
                                            e.target.checked
                                        )
                                    }
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Button>Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Collapse>
        </>
    );
};

const ProductsHeader = ({ onAddNewProductClick, onFilterChange }) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <Row className="mb-1 d-flex" style={{ width: "100%" }}>
                <Col>
                    <h1 className="ms-4 float-start rounded-pill">
                        Your Products
                    </h1>
                </Col>
                <Col>
                    <Button
                        variant="success"
                        className="float-end rounded-pill px-3"
                        onClick={() => {
                            onAddNewProductClick();
                        }}
                    >
                        + Add
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setShowFilters((prev) => !prev)}
                        className="float-end rounded-pill px-3 me-2"
                    >
                        Filters
                    </Button>
                </Col>
                <hr className="my-2 border-primary" />
            </Row>
            <FilterComponent
                onFilterChange={onFilterChange}
                showFilters={showFilters}
            />
        </>
    );
};

export default ProductsHeader;
