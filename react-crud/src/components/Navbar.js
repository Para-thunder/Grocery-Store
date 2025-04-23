import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Badge } from '@mui/material';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { cart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className={`navbar-home ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FaHome className="home-icon" />
          <span> Home</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/products"
            className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            <span>Products</span>
          </Link>

          <Link
            to="/categories"
            className={`navbar-link ${location.pathname === '/categories' ? 'active' : ''}`}
          >
            <span>Categories</span>
          </Link>

          <Link
            to="/cart"
            className={`navbar-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            <Badge badgeContent={cart.length} color="primary">
              <FaShoppingCart className="nav-icon" />
            </Badge>
          </Link>

          <div className="navbar-user" ref={dropdownRef}>
            <FaUser 
              className="user-icon" 
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            />
            {showDropdown && (
              <div className="user-dropdown">
                <Link 
                  to="/login" 
                  className="dropdown-link"
                  onClick={() => setShowDropdown(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="dropdown-link"
                  onClick={() => setShowDropdown(false)}
                >
                  Sign Up
                </Link>
                <Link 
                  to="/profile" 
                  className="dropdown-link"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;