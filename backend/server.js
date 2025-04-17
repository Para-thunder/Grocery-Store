require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB"); // Import the connectDB function

const { sequelize } = require("./models/Index.js"); // Import sequelize instance

const app = express();
const port = process.env.PORT || 4000;

// Routes imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Add this line

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/cart", cartRoutes); // Add this line

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Start server
app.listen(port, async () => {
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  await testConnection();
});