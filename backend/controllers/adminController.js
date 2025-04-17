const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");

// 1. ADMIN DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  const queries = {
    totalSales: "SELECT SUM(total_amount) AS total FROM Orders",
    totalProducts: "SELECT COUNT(*) AS total FROM Products",
    totalUsers: "SELECT COUNT(*) AS total FROM Users",
    recentOrders: `
      SELECT TOP 5 o.order_id, u.email, o.total_amount, o.order_date 
      FROM Orders o
      JOIN Users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `
  };

  try {
    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const data = await new Promise((resolve, reject) => {
        sql.query(connectionString, query, (err, result) => {
          if (err) reject(err);
          resolve(result.recordset[0]);
        });
      });
      results[key] = data;
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. PRODUCT MANAGEMENT
exports.getAllProducts = (req, res) => {
  const query = `
    SELECT p.*, c.name AS category_name 
    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.category_id
  `;
  
  sql.query(connectionString, query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result.recordset);
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category_id } = req.body;

  const query = `
    UPDATE Products 
    SET name = ?, price = ?, stock = ?, category_id = ?
    WHERE product_id = ?
  `;

  sql.query(connectionString, query, [name, price, stock, category_id, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Update failed", error: err });
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated successfully" });
  });
};

// 3. ORDER MANAGEMENT
exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const query = `UPDATE Orders SET status = ? WHERE order_id = ?`;
  
  sql.query(connectionString, query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Update failed", error: err });
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order status updated" });
  });
};

// 4. USER MANAGEMENT
exports.getAllUsers = (req, res) => {
  const query = `
    SELECT user_id, email, name, created_at, is_admin 
    FROM Users
    ORDER BY created_at DESC
  `;
  
  sql.query(connectionString, query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result.recordset);
  });
};

exports.toggleAdminStatus = (req, res) => {
  const { id } = req.params;
  const query = `
    UPDATE Users 
    SET is_admin = CASE WHEN is_admin = 1 THEN 0 ELSE 1 END
    WHERE user_id = ?
  `;

  sql.query(connectionString, query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Update failed", error: err });
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Admin status updated" });
  });
};