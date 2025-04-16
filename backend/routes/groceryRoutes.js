const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryProducts,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getPayment,
  updatePayment,
  getDelivery,
  getOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  getInventories,
  deleteInventory,  
  updateInventory,
  createInventory
} = require("../controllers/groceryController.js");

// Product routes
router.get("/products", getProducts);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Category routes
router.get("/categories", getCategory);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/categories/:categoryId/products", getCategoryProducts);
// Inventory routes
router.get("/inventories", getInventories);
router.post("/inventory", createInventory);
router.patch("/inventory/:id", updateInventory);
router.delete("/inventory/:id", deleteInventory);

// Order routes
router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.patch("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

// Payment routes
router.get('/payment/:orderId', getPayment);
router.patch('/payment/:orderId', updatePayment);

// Delivery routes
router.get('/delivery/order/:orderId', getDelivery);

// Debug routes
router.get("/run-query", (req, res) => {
  res.send("GET: Run Query Route is working!");
});

router.post("/run-query", (req, res) => {
  res.send("POST: Run Query Route is working!");
});

module.exports = router;