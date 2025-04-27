/*authRoutes.js*/
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authmiddleware");
const { login, register,getCustomerProfile,updateCustomerProfile } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/profile",authenticate,getCustomerProfile);
router.put('/users/profile', authenticate, updateCustomerProfile);
module.exports = router;