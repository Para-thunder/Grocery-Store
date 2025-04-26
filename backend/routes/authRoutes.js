/*authRoutes.js*/
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authmiddleware");
const { login, register,getCustomerProfile } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/profile",authenticate,getCustomerProfile);

module.exports = router;