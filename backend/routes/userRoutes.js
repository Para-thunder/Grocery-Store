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


// ----------------------------
// Product Browsing
// ----------------------------
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/categories", getCategory);
router.get("/categories/:categoryId/products", getCategoryProducts);

router.get("/orders", authenticate, getAllOrders);
router.post("/orders", authenticate, createOrder);
router.get("/orders/:id", authenticate, getOrderDetails);
router.patch("/orders/:id/status", authenticate, updateOrderStatus);

module.exports = router;