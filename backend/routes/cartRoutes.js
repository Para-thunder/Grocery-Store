const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { getCart, addToCart, updateCartItem, deleteCartItem } = require("../controllers/cartController");

router.get("/cart", authenticate, getCart);
router.post("/cart", authenticate, addToCart);
router.patch("/cart",authenticate, updateCartItem);
router.delete("/cart",authenticate, deleteCartItem);


module.exports = router;