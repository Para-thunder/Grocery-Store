const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authmiddleware");
const { getCartItems, addToCart, updateCartQuantity, removeFromCart } = require("../controllers/cartController");

router.get("/cart/:user_id", authenticate, getCartItems);
router.post("/cart", authenticate, addToCart);
router.patch("/cart",authenticate, updateCartQuantity);
router.delete("/cart",authenticate, removeFromCart);


module.exports = router;