const express = require("express");
const router = express.Router();
const { authenticate, adminOnly } = require("../middlewares/authMiddleware");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  updatePayment
} = require("../controllers/groceryController");
/* const {
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const {
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/inventoryController"); */

// Product management
router.post("/products", authenticate, adminOnly, createProduct);
router.patch("/products/:id", authenticate, adminOnly, updateProduct);
router.delete("/products/:id", authenticate, adminOnly, deleteProduct);

// Category management
router.post("/categories", authenticate, adminOnly, createCategory);
router.patch("/categories/:id", authenticate, adminOnly, updateCategory);
router.delete("/categories/:id", authenticate, adminOnly, deleteCategory);

// Inventory management
router.get("/inventories", authenticate, adminOnly, getInventories);
router.post("/inventory", authenticate, adminOnly, createInventory);
router.patch("/inventory/:id", authenticate, adminOnly, updateInventory);
router.delete("/inventory/:id", authenticate, adminOnly, deleteInventory);

// Order management
router.get("/admin/orders", authenticate, adminOnly, getAllOrders);
router.patch("/admin/orders/:id/status", authenticate, adminOnly, updateOrderStatus);

// Payment management
router.patch('/admin/payment/:orderId', authenticate, adminOnly, updatePayment);

/* module.exports = router;

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/authMiddleware");

// Protect all admin routes
router.use(isAdmin);

// Dashboard
router.get("/dashboard", adminController.getDashboardStats);

// Product Management
router.get("/products", adminController.getAllProducts);
router.put("/products/:id", adminController.updateProduct);

// Order Management
router.put("/orders/:id/status", adminController.updateOrderStatus);

// User Management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/admin", adminController.toggleAdminStatus);

module.exports = router; */