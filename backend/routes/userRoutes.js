const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  getProducts,
} = require("../controllers/productController");
const {
    getCategory,
  } = require("../controllers/categoryController");
/* const {
  getUserOrders,
  createOrder,
  cancelOrder
} = require("../controllers/orderController"); */

// Product browsing
router.get("/products", getProducts);
router.get("/categories", getCategory);

// Order management
/* router.get("/orders", authenticate, getUserOrders);
router.post("/orders", authenticate, createOrder);
router.patch("/orders/:id/cancel", authenticate, cancelOrder); */

// Payment & delivery
/* router.get('/payment/:orderId', authenticate, getPayment);
router.get('/delivery/order/:orderId', authenticate, getDelivery); */

module.exports = router;