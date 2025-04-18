/* require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB"); // Import the connectDB function

const { sequelize } = require("./models/Index.js"); // Import sequelize instance


(async () => {
  try {
    await sequelize.sync({ alter: true }); // Use `alter: true` to update the schema without dropping data
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Failed to sync database:', error);
  }
})();

(async () => {
  try {
    await sequelize.sync({ force: false }); // Avoid altering existing tables
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Failed to sync database:', error);
  }
})();
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

// Start server
app.listen(port, async () => {
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  await testConnection();
}); */

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/Index.js"); // Import sequelize instance

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/cart", cartRoutes);

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