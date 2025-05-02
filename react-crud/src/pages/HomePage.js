import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingBasket, 
  FaTags, 
  FaFire,
  FaFileContract 
} from 'react-icons/fa';
import '../styles/Home.css';

const HomePage = () => {
  return (
    <div className="animated-background">
      <div className="home-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="banner-content">
            <h1>Welcome to Online Grocery Manager</h1>
            <p>All your grocery needs in one place</p>
          </div>
        </div>

        {/* Dashboard Section */}
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

            <Link to="/top-selling" className="dashboard-card top-selling-card">
              <div className="card-icon">
                <FaFire />
              </div>
              <h3>Top Selling</h3>
              <p>See what's selling like hotcakes!</p>
            </Link>

            {/* New Shopping Policies Card */}
            <Link to="/policies" className="dashboard-card policies-card">
              <div className="card-icon">
                <FaFileContract />
              </div>
              <h3>Shopping Policies</h3>
              <p>Returns, payments & terms</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;