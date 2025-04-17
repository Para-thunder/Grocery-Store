const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");

// Import all controller functions needed for the store frontend
const {
  getProducts,
  getProductById
} = require("../controllers/productController");

const {
  getCategory,
  getCategoryProducts
} = require("../controllers/categoryController");

const {
  createOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  getCart,
  addToCart,
  removeFromCart
} = require("../controllers/cartController");

// ----------------------------
// Product Browsing
// ----------------------------
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/categories", getCategory);
router.get("/categories/:categoryId/products", getCategoryProducts);

// ----------------------------
// Shopping Cart
// ----------------------------
router.get("/cart", authenticate, getCart);
router.post("/cart", authenticate, addToCart);
//router.put("/cart/:itemId", authenticateUser, updateCart);
router.delete("/cart/:itemId", authenticate, removeFromCart);

// ----------------------------
// Order Management
// ----------------------------
router.get("/orders", authenticate, getAllOrders);
router.post("/orders", authenticate, createOrder);
router.get("/orders/:id", authenticate, getOrderDetails);
router.patch("/orders/:id/status", authenticate, updateOrderStatus);

module.exports = router;