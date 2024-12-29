import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    Row,
    Col,
    Container,
    Pagination,
} from "react-bootstrap";
import "../styles/products/Products.css";

import {
    ProductCardFixture,
    ProductCard,
} from "../components/products/ProcuctCard";
import ProductDetailModal from "../components/products/ProductDetailModal";
import ProductsHeader from "../components/products/ProductsHeader";
import CreateProductModal from "../components/products/CreateProdcutModal";
import { ProductsApi } from "../apis/ProductsApi";
import { showGlobalAlert } from "../components/core/KhoshAlert";

const PaginationItems = ({ onPageClick, pageCount }) => {
    const items = [];
    const [activePage, setActivePage] = useState(1);
    console.log(pageCount);
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
    const [products, setProducts] = useState([]);
    const [npages, setNpages] = useState(1);
    const [limit, setLimit] = useState(10);
    

    const onFilterChange = (filters) => {
        setFilters(filters);
    };

    const fetchProducts = async (page) => {
        await ProductsApi.getProducts(filters, (page - 1) * limit, limit)
            .then((response) => {
                setProducts(response.products);
                setNpages(Math.floor(response.total / response.limit + 1))
            })
            .catch((error) => {
                // TODO: change to display message better
                showGlobalAlert({
                    variant: "danger",
                    message: "Error uploading product",
                });
            });
    }

    useEffect(() => {
        fetchProducts(1);
    }, [filters]);

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
                    onPageClick={(page) => {fetchProducts(page)}}
                    pageCount={npages}
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
