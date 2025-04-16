/*HomePage.js*/
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBasket, FaTags, FaClipboardList } from 'react-icons/fa';
import '../styles/Home.css';

const HomePage = () => {
  return (
    <div className="home-content">
      {/* Navbar removed from here */}
      <div className="welcome-banner">
     
      <div className="particles">
    {[...Array(15)].map((_, i) => (
      <div key={i} className="particle" style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        animationDelay: `${Math.random() * 5}s`
      }}></div>
    ))}
  </div>
      <div className="banner-decoration circle-1"></div>
  <div className="banner-decoration circle-2"></div>
  <div className="banner-decoration circle-3"></div>
  <svg className="banner-svg banner-svg-1" viewBox="0 0 100 100">
    <path fill="rgba(255,255,255,0.1)" d="M50 0 L100 50 L50 100 L0 50 Z"/>
  </svg>
  <div className="banner-content"></div>
        <h1>Welcome to Online Grocery Manager</h1>
        <p>All your grocery needs in one place</p>
      </div>

      <div className="dashboard-section">
        <h2>Managing online store just got easier!</h2>
        <p className="subtitle">Select a section</p>

        <div className="card-container">
        
<Link to="/products" className="dashboard-card product-card">
  <div className="card-content">
    <div className="card-icon">
      <FaShoppingBasket />
    </div>
    <h3>Explore Products</h3>
    <p>Browse all store products</p>
  </div>
</Link>

          <Link to="/categories" className="dashboard-card category-card">
            <div className="card-icon">
              <FaTags />
            </div>
            <h3>Categories</h3>
            <p>Shop by categories</p>
          </Link>

          <Link to="/orders" className="dashboard-card order-card">
            <div className="card-icon">
              <FaClipboardList />
            </div>
            <h3>Orders</h3>
            <p>View past orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;