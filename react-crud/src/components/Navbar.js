import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { Badge, TextField, InputAdornment, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useCart } from '../context/CartContext';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
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

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/products/search?name=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`);
    setShowResults(false);
    setSearchQuery('');
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

        <div className="navbar-search" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  width: '250px'
                }
              }}
            />
          </form>
          
          {showResults && searchResults.length > 0 && (
            <Paper className="search-results" elevation={3}>
              <List>
                {searchResults.map((product) => (
                  <ListItem 
                    key={product.product_id} 
                    button
                    onClick={() => handleResultClick(product.product_id)}
                  >
                    <ListItemText 
                      primary={product.name} 
                      secondary={`$${product.price} - ${product.category_name}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </div>

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