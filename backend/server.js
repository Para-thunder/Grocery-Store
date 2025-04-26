require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/index.js"); // Import sequelize instance

const app = express();
const port = process.env.PORT || 4000;

// Middleware
//app.use(cors());
// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
  credentials: true, // Allow cookies and credentials
}));
app.use(express.json());

// Routes imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api", cartRoutes);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Sync database and start server
(async () => {
  try {
    await sequelize.sync(); // Removed { alter: true }
    console.log('✅ Database synced successfully');
    await testConnection();
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to sync database:', error);
  }
})();