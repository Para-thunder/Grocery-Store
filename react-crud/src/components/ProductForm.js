import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      name,
      price: parseFloat(price),
      categoryId,
    };

    axios.post("/api/products", product)
      .then(() => {
        alert("Product added!");
        setName("");
        setPrice("");
        setCategoryId("");
        onProductAdded?.();  // Refresh list if parent provides callback
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Failed to add product");
      });
  };

  return (
    <div>
      <h3>Add Product</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default ProductForm;
