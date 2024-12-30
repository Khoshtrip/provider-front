import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Row, Col, Container, Pagination } from "react-bootstrap";
import { ProductCard } from "../components/products/ProcuctCard";
import ProductDetailModal from "../components/products/ProductDetailModal";
import ProductsHeader from "../components/products/ProductsHeader";
import CreateProductModal from "../components/products/CreateProdcutModal";
import { ProductsApi } from "../apis/ProductsApi";
import KhoshAlert, { showGlobalAlert } from "../components/core/KhoshAlert";
import "../styles/products/Products.css";
import Khoshpinner from "../components/core/Khoshpinner";

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
    const [productDetailId, setProductDetailId] = useState(undefined);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [products, setProducts] = useState([]);
    const [npages, setNpages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const onFilterChange = (filters) => {
        setFilters(filters);
    };

    const fetchProducts = async (page) => {
        setIsLoading(true);
        await ProductsApi.getProducts(filters, (page - 1) * limit, limit)
            .then((response) => {
                setProducts(response.data.products);
                setNpages(Math.ceil(response.data.total / response.data.limit));
            })
            .catch((error) => {
                // TODO: change to display message better
                showGlobalAlert({
                    variant: "danger",
                    message: "Error uploading product",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const updateProducts = (product, isDelete=false) => {
        if (isDelete){
            setProducts(products.filter((item, _) => (item.id !== product.id)));
            setProductDetailId(undefined);
        }
        else{
            const index = products.findIndex(item => item.id === product.id);
            if (index !== -1) {
                setProducts(products.map((item, i) => (i === index ? product : item)));
            }else if (products.length < limit){
                setProducts([...products, product]);
            }
        }
    }

    return (
        <>
            <Container className="d-flex flex-column justify-content-center align-items-center mt-4 mb-2">
                <ProductsHeader
                    className="d-flex flex-column"
                    onAddNewProductClick={() => {
                        setShowCreateModal(true);
                    }}
                    onFilterChange={onFilterChange}
                    onApplyFilters={() => {
                        fetchProducts(1);
                    }}
                />

                {isLoading && <Khoshpinner />}
                {!isLoading && (
                    <>
                        <Row
                            className="mb-3 justify-content-mx-center"
                            md="auto"
                        >
                            {products.map((product, index) => (
                                <Col key={index} className="mb-3">
                                    <ProductCard
                                        product={product}
                                        onProductClick={(id) =>{
                                            setProductDetailId(id);
                                            setShowDetailModal(true);
                                            }
                                        }
                                    />
                                </Col>
                            ))}
                            {products.length === 0 && (
                                <h1 className="text-center">
                                    No products found
                                </h1>
                            )}
                        </Row>
                    </>
                )}
                <PaginationItems
                    onPageClick={(page) => {
                        fetchProducts(page);
                    }}
                    pageCount={npages}
                    className="text-center align-items-center"
                />
            </Container>
            <ProductDetailModal
                show={showDetailModal}
                onHide={(product, isDelete) => {
                    if (product !== undefined) updateProducts(product, isDelete);
                    setShowDetailModal(false);
                }
                }
                productId = {productDetailId}
            />
            <CreateProductModal
                show={showCreateModal}
                onHide={(product) => {
                    if (product !== undefined) updateProducts(product);
                    setShowCreateModal(false)
                }
                }
            />
        </>
    );
};

export default Products;
