/*Home.js*/
import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'products') {
          const productsData = await getProducts();
          setProducts(productsData);
        } else {
          const categoriesData = await getCategories();
          setCategories(categoriesData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    if (activeTab === 'products') {
      return (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.product_id} className="product-card">
              <h3 className="product-name">{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.price}</p>
              <p>Category: {product.category_name}</p>
              <p className="product-stock">Stock: {product.available_quantity}</p>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="categories-list">
          {categories.map(category => (
            <span key={category.category_id} className="category-tag">
              {category.category_name}
            </span>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="home">
      <header className="header">
        <h1>Grocery Store Dashboard</h1>
      </header>
      
      <nav className="nav">
        <button 
          className={`nav-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`nav-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
      </nav>
      
      <main className="container">
        <section className="section">
          <h2 className="section-title">
            {activeTab === 'products' ? 'All Products' : 'Product Categories'}
          </h2>
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default Home;