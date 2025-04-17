const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { getCart, addToCart } = require("../controllers/cartController");

router.get("/cart", authenticate, getCart);
router.post("/cart", authenticate, addToCart);

module.exports = router;