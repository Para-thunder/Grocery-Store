const express = require("express");
const sql = require("msnodesqlv8");
const connectionString = require("./config/connectDB.js");
const cors = require("cors");

// Import the separated route files
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

const app = express();
const serverPort = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection test
const testConnection = () => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Database connection failed:", err);
      process.exit(1); // Exit if DB connection fails
    } else {
      console.log("Connected to database successfully!");
      console.log(`Server is running at: http://localhost:${serverPort}`);
      conn.close(); // Close the test connection
    }
  });
};

// API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api", userRoutes); // User-facing routes
app.use("/api/admin", adminRoutes); // Admin-only routes

// Health check endpoint
app.get("/", (req, res) => {
  return res.json({ 
    status: "running",
    message: "Grocery Store API is operational",
    timestamp: new Date().toISOString()
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

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});

// Start server
app.listen(serverPort, () => {
  testConnection();
});