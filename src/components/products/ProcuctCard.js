import {
    Card,
    Badge,
    ListGroup,
    Stack,
    Button,
    Col,
    Row,
} from "react-bootstrap";
import { ProductsApi } from "../../apis/ProductsApi";

export const ProductCardFixture = {
    id: 1,
    name: "Product 1",
    description: "Product 1 description",
    price: 100,
    images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/180",
    ],
    summary: "Product 1 summary",
    stock: 10,
    category: "Category 1",
    rating: 4.5,
    discount: 33,
    status: "active",
};

export const ProductCard = ({ product, onProductClick }) => {
    const newPrice =
        product.discount > 0
            ? product.price * (1 - product.discount / 100)
            : product.price;

    const onChangeStatusClick = (productId, status) => {
        if (status === "deactive") {
            ProductsApi.deactivateProduct(productId)
                .then((response) => {
                    //TODO: reload this product
                })
                .catch((error) => {
                    //TODO: Error Handling
                });
        } else {
            ProductsApi.activateProduct(productId)
                .then((response) => {
                    //TODO: reload this product
                })
                .catch((error) => {
                    //TODO: Error Handling 
                });
        }
    };

    return (
        <Card
            style={{ width: "18rem", cursor: "pointer" }}
            onClick={() => onProductClick(product)}
        >
            <Card.Img
                variant="top"
                src={(product.image == null)?"https://via.placeholder.com/150":product.images[0]}
                sizes="(max-width: 600px) 150px"
            />:
        
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>
                    <Stack direction="horizontal" gap={2}>
                        <strong>Price:</strong>
                        <span>
                            {product.discount > 0 ? (
                                <>
                                    <del>{product.price}$</del>
                                    <strong className="ms-2">
                                        {newPrice}$
                                    </strong>
                                    <Badge
                                        pill
                                        bg="danger"
                                        className="ms-2 p-1 px-4"
                                    >
                                        {product.discount}% OFF
                                    </Badge>
                                </>
                            ) : (
                                <strong className="ms-2">{newPrice}$</strong>
                            )}
                        </span>
                    </Stack>
                </ListGroup.Item>
                <ListGroup.Item>
                    {product.stock > 0
                        ? product.stock < 10
                            ? "Less Than 10 remaining"
                            : "In stock"
                        : "Out of stock"}
                </ListGroup.Item>
            </ListGroup>
            <Card.Footer>
                <Row className="justify-content-between align-items-center">
                    <Col>
                        <Badge pill bg="dark" className="p-2 px-3">
                            {product.category}
                        </Badge>
                    </Col>
                    <Col>
                        <Button
                            className="ms-5"
                            size="sm"
                            onClick={(event) => {
                                event.stopPropagation();
                                onChangeStatusClick(product.id, product.isActive);
                            }}
                        >
                            {product.isActive
                                ? "Deactivate"
                                : "Ativate"}
                        </Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};
