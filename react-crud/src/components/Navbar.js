//import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart } from 'react-icons/fa';
import { Badge } from '@mui/material'; // To add cart item count badge
import { useCart } from '../context/CartContext'; // Import your CartContext
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { cart } = useCart(); // Access cart data from context

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left-aligned Home link with icon */}
        <Link
          to="/"
          className={`navbar-home ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FaHome className="home-icon" />
          <span> Home</span>
        </Link>

        {/* Right-aligned links */}
        <div className="navbar-links">
          {/* Products Link */}
          <Link
            to="/products"
            className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            
            <span>Products</span>
          </Link>

          {/* Categories Link */}
          <Link
            to="/categories"
            className={`navbar-link ${location.pathname === '/categories' ? 'active' : ''}`}
          >
            
            <span>Categories</span>
          </Link>

          {/* Orders Link */}
          <Link
            to="/orders"
            className={`navbar-link ${location.pathname === '/orders' ? 'active' : ''}`}
          >
          
            <span>Orders</span>
          </Link>

          {/* Cart Link with Badge */}
          <Link
            to="/cart"
            className={`navbar-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <Badge badgeContent={cart.length} color="primary">
              <FaShoppingCart className="nav-icon" />
            </Badge>
            
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
