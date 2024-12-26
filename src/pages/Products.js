import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Row, Col, Stack, Container, Pagination } from "react-bootstrap";
import "../styles/products/Products.css";

import {
    ProductCardFixture,
    ProductCard,
} from "../components/products/ProcuctCard";
import ProductDetailModal from "../components/products/ProductDetailModal";

function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

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
    const [showModal, setShowModal] = useState(false);

    const products = [
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
        ProductCardFixture,
    ];

    return (
        <>
            <Container className="d-flex flex-column justify-content-center align-items-center mt-4 mb-2">
                <Row className="mb-3 justify-content-mx-center" md="auto">
                    {products.map((product, index) => (
                        <Col key={index} className="mb-3">
                            <ProductCard
                                product={product}
                                onProductClick={(id) => setShowModal(true)}
                            />
                        </Col>
                    ))}
                </Row>
                <PaginationItems
                    onPageClick={(page) => console.log(page)}
                    pageCount={20}
                    className="text-center align-items-center"
                />
            </Container>
            <ProductDetailModal
                show={showModal}
                onHide={() => setShowModal(false)}
            />
        </>
    );
};

export default Products;
