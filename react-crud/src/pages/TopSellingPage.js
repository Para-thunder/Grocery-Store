import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa';
import '../styles/TopSelling.css';

const TopSellingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await fetch(`/api/inventory/top-selling?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch top selling products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, [limit]);

  

  if (loading) {
    return (
      <div className="animated-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animated-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="animated-background">
      <div className="top-selling-container page-content">
        <div className="top-selling-header">
          <h1>
            <FaFire className="fire-icon" style={{ color: '#ff0000' }} /> Top Selling Products
          </h1>
          
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <div key={product.product_id} className="product-card">
              <div className="product-rank">
                #{index + 1}
                {index < 3 && <span className="hot-badge">HOT</span>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-stats">
                  <div className="price">${product.price.toFixed(2)}</div>
                  <div className="sales-count">
                    <FaFire className="fire-icon-small" style={{ color: '#ff0000' }} />
                    {product.total_sold} sold
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSellingPage;