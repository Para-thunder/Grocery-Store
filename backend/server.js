require('dotenv').config(); // Must be first

const express = require("express");
const sql = require("msnodesqlv8");
const cors = require("cors");

const app = express();
const serverPort = process.env.PORT || 4000;
const connectionString = require("./config/connectDB.js");

// Routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const groceryRouter = require("./routes/groceryRoutes.js");
const cartRoutes = require("./routes/cartRoutes");
// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Test
const testConnection = () => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    } else {
      console.log("✅ Connected to database successfully!");
      console.log(`🚀 Server running at: http://localhost:${serverPort}`);
      if (conn) conn.close();
    }
  });
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", groceryRouter); // ← ✅ your grocery routes restored
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
// Health check
app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "Grocery Store API is operational",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Environment check
app.get("/env-check", (req, res) => {
  res.json({
    jwtSecret: process.env.JWT_SECRET ? "Loaded" : "Missing",
    dbServer: process.env.DB_SERVER ? "Loaded" : "Missing",
    dbName: process.env.DB_NAME ? "Loaded" : "Missing",
    port: process.env.PORT || 4000
  });
});

// 404 Handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    method: req.method
  });
});

// 500 Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});

// Start Server
app.listen(serverPort, () => {
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  testConnection();
});
