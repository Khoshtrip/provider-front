import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
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
import "../styles/products/Products.css";

import {
    ProductCardFixture,
    ProductCard,
} from "../components/products/ProcuctCard";
import ProductDetailModal from "../components/products/ProductDetailModal";
import ProductsHeader from "../components/products/ProductsHeader";
import CreateProductModal from "../components/products/CreateProdcutModal";

const PaginationItems = ({ onPageClick, pageCount }) => {
    const items = [];
    const [activePage, setActivePage] = useState(1);

    for (
        let number = Math.max(activePage - 3, 1);
        number <= Math.min(activePage + 3, pageCount);
        number++
    ) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === activePage}
                onClick={() => {
                    onPageClick(number);
                    setActivePage(number);
                }}
            >
                {number}
            </Pagination.Item>
        );
    }

    return (
        <Pagination>
            {activePage !== 1 && (
                <Pagination.Prev
                    onClick={() => {
                        onPageClick(activePage - 1);
                        setActivePage(activePage - 1);
                    }}
                />
            )}
            {activePage > 5 && <Pagination.Ellipsis />}
            {items}
            {activePage < pageCount - 5 && <Pagination.Ellipsis />}
            {activePage !== pageCount && (
                <Pagination.Next
                    onClick={() => {
                        onPageClick(activePage + 1);
                        setActivePage(activePage + 1);
                    }}
                />
            )}
        </Pagination>
    );
};

const Products = () => {
    const { user } = useContext(AuthContext);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [products, setProducts] = useState([
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
    ]);

    const onFilterChange = (filters) => {
        setFilters(filters);
    };

    return (
        <>
            <Container className="d-flex flex-column justify-content-center align-items-center mt-4 mb-2">
                <ProductsHeader
                    className="d-flex flex-column"
                    onAddNewProductClick={() => {
                        setShowCreateModal(true);
                    }}
                    onFilterChange={onFilterChange}
                />
                <Row className="mb-3 justify-content-mx-center" md="auto">
                    {products.map((product, index) => (
                        <Col key={index} className="mb-3">
                            <ProductCard
                                product={product}
                                onProductClick={(id) =>
                                    setShowDetailModal(true)
                                }
                            />
                        </Col>
                    ))}
                    {products.length === 0 && (
                        <h1 className="text-center">No products found</h1>
                    )}
                </Row>
                <PaginationItems
                    onPageClick={(page) => console.log(page)}
                    pageCount={20}
                    className="text-center align-items-center"
                />
            </Container>
            <ProductDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
            />
            <CreateProductModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
            />
        </>
    );
};

export default Products;
