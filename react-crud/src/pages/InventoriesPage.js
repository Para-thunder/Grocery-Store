// src/pages/InventoriesPage.js
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import '../styles/inventories.css';

const InventoriesPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const data = await getProducts(); // Assuming inventories = products
        setInventories(data);
      } catch (err) {
        console.error("Error loading inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventories();
  }, []);

  if (loading) return <div>Loading inventories...</div>;

  return (
    <div className="inventory-container">
      <h1>Inventories</h1>
      <div className="inventory-grid">
        {inventories.map(item => (
          <div className="inventory-card" key={item.product_id}>
            <img src={item.image || "/placeholder.png"} alt={item.product_name} />
            <h3>{item.product_name}</h3>
            <p>ID: {item.product_id}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoriesPage;
