import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import { CartProvider } from './context/CartContext'; // ✅ import the context
import CartPage from './pages/CartPage';
function App() {
  return (
    <CartProvider> {/* ✅ Wrap everything inside this */}
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/categories/:categoryId/products" element={<CategoryProductsPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
