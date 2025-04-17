const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middlewares/authMiddleware");

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
  updateCart,
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
router.get("/cart", authenticateUser, getCart);
router.post("/cart", authenticateUser, addToCart);
router.put("/cart/:itemId", authenticateUser, updateCart);
router.delete("/cart/:itemId", authenticateUser, removeFromCart);

// ----------------------------
// Order Management
// ----------------------------
router.get("/orders", authenticateUser, getAllOrders);
router.post("/orders", authenticateUser, createOrder);
router.get("/orders/:id", authenticateUser, getOrderDetails);
router.patch("/orders/:id/status", authenticateUser, updateOrderStatus);

module.exports = router;