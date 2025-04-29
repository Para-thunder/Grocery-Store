const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authmiddleware");

// Import all controller functions needed for the store frontend
const {
  getProducts,
  searchProductsByName
} = require("../controllers/productController");

const {
  getCategory,
  getProductsByCategory
} = require("../controllers/categoryController");

const {
  createOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  getOrdersByUserId
} = require("../controllers/orderController");
const { getPayment } = require("../controllers/paymentController");
const { getNewArrivals,
  getTopSellingProducts } = require("../controllers/inventoryController");

router.get('/payment', getPayment);
// ----------------------------
// Product Browsing
// ----------------------------
router.get("/products", getProducts);
router.get("/products/search", searchProductsByName);
//router.get("/products/:id", getProductById);
router.get("/categories", getCategory);
router.get("/categories/:categoryId/products", getProductsByCategory);

router.get("/orders", authenticate, getAllOrders);
router.post("/orders", authenticate, createOrder);
router.get("/orders/:id", authenticate, getOrderDetails);
router.patch("/orders/:id/status", authenticate, updateOrderStatus);
router.get("/users/orders", authenticate, getOrdersByUserId);


router.get("/inventory/new-arrivals", getNewArrivals);
router.get("/inventory/top-selling", getTopSellingProducts);

module.exports = router;