require('dotenv').config(); // Must be first line

const express = require("express");
const sql = require("msnodesqlv8");
const connectionString = require("./config/connectDB.js");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

const app = express();
const serverPort = process.env.PORT || 4000; // Use from .env

// Middleware
app.use(cors());
app.use(express.json());

// Database connection test
const testConnection = () => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
    } else {
      console.log("Connected to database successfully!");
      console.log(`Server is running at: http://localhost:${serverPort}`);
      if (conn) conn.close();
    }
  });
};

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "running",
    message: "Grocery Store API is operational",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Environment check endpoint
app.get('/env-check', (req, res) => {
  res.json({
    jwtSecret: process.env.JWT_SECRET ? "Loaded" : "Missing",
    dbServer: process.env.DB_SERVER ? "Loaded" : "Missing",
    dbName: process.env.DB_NAME ? "Loaded" : "Missing",
    port: process.env.PORT
  });
});

// Error handlers
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.url,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});

// Start server
app.listen(serverPort, () => {
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  testConnection();
});