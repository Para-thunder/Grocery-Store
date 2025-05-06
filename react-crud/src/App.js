// Update your App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import ProfilePage from './pages/ProfilePage'; // Add this import
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import TopSellingPage from './pages/TopSellingPage';
import PoliciesPage from './pages/PoliciesPage';
import DealsPage from './pages/DealsPage';
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* Add this route */}
            <Route path="/categories/:categoryId/products" element={<CategoryProductsPage />} />
            <Route path="/top-selling" element={<TopSellingPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/deals" element={<DealsPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;