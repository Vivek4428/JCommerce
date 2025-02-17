import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}`
      );
      setProduct(response.data);
      if (response.data.imageName) {
        fetchImage();
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => navigate(`/product/update/${id}`);

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="containers" style={styles.container}>
      <img
        className="left-column-img"
        src={imageUrl}
        alt={product.imageName}
        style={styles.image}
      />

      <div className="right-column" style={styles.rightColumn}>
        <div className="product-description">
          <div style={styles.header}>
            <span style={styles.category}>{product.category}</span>
            <p className="release-date">
              <h6>
                Listed:{" "}
                <span>
                  <i>{new Date(product.releaseDate).toLocaleDateString()}</i>
                </span>
              </h6>
            </p>
          </div>

          <h1 style={styles.productName}>{product.name}</h1>
          <i style={styles.brand}>{product.brand}</i>

          <p style={styles.sectionTitle}>PRODUCT DESCRIPTION:</p>
          <p>{product.description}</p>
        </div>

        <div className="product-price">
          <span style={styles.price}>{"$" + product.price}</span>
          <button
            className={`cart-btn ${
              !product.productAvailable ? "disabled-btn" : ""
            }`}
            onClick={handleAddToCart}
            disabled={!product.productAvailable}
            style={styles.cartButton}
          >
            {product.productAvailable ? "Add to cart" : "Out of Stock"}
          </button>
          <h6 style={styles.stock}>
            Stock Available:{" "}
            <i style={styles.stockCount}>{product.stockQuantity}</i>
          </h6>
        </div>

        <div className="update-button" style={styles.buttonGroup}>
          <button
            className="btn btn-primary"
            onClick={handleEditClick}
            style={styles.editButton}
          >
            Update
          </button>
          <button
            className="btn btn-danger"
            onClick={deleteProduct}
            style={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex" },
  image: { width: "50%", height: "auto" },
  rightColumn: { width: "50%" },
  header: { display: "flex", justifyContent: "space-between" },
  category: { fontSize: "1.2rem", fontWeight: "lighter" },
  productName: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    textTransform: "capitalize",
    letterSpacing: "1px",
  },
  brand: { marginBottom: "3rem" },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
    margin: "10px 0px 0px",
  },
  price: { fontSize: "2rem", fontWeight: "bold" },
  cartButton: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  stock: { marginBottom: "1rem" },
  stockCount: { color: "green", fontWeight: "bold" },
  buttonGroup: { display: "flex", gap: "1rem" },
  editButton: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Product;
