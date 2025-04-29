const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");
const Inventory = require("../models/Inventory"); // Adjust the path to your Inventory model
const { sequelize } = require('../models/index'); // Adjust the path to your sequelize instance
const Product = require("../models/Product"); // Adjust the path to your Product model
const Order = require("../models/Order"); // Adjust the path to your Order model
const OrderItem = require("../models/OrderItem"); // Adjust the path to your OrderItem model
// Get all Inventories
const getInventories = (req, res) => {
    const query = "SELECT * FROM Inventory"; // ✅ singular table name
    try {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          return res.status(500).send("Error: " + err);
        }
        return res.json(rows);
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  const createInventory = (req, res) => {
    const { product_id, available_quantity } = req.body;
  
    if (!product_id || available_quantity === undefined) {
      return res.status(400).send("Both product_id and available_quantity are required.");
    }
  
    const query = `
      INSERT INTO Inventory (product_id, available_quantity)
      VALUES (${product_id}, ${available_quantity})
    `;
  
    try {
      sql.query(connectionString, query, (err, result) => {
        if (err) {
          return res.status(500).send("Error creating inventory: " + err.message);
        }
        return res.status(201).send("Inventory record created successfully");
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  const updateInventory = (req, res) => {
    const { id } = req.params;
    const { available_quantity } = req.body;
  
    if (available_quantity === undefined) {
      return res.status(400).send("available_quantity is required.");
    }
  
    const query = `
      UPDATE Inventory
      SET available_quantity = ${available_quantity}
      WHERE inventory_id = ${id}
    `;
  
    try {
      sql.query(connectionString, query, (err, result) => {
        if (err) {
          return res.status(500).send("Error updating inventory: " + err.message);
        }
        return res.status(200).send("Inventory updated successfully");
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  const deleteInventory = (req, res) => {
    const { id } = req.params;
  
    const query = `
      DELETE FROM Inventory 
      WHERE inventory_id = ${id}
    `;
  
    try {
      sql.query(connectionString, query, (err, result) => {
        if (err) {
          return res.status(500).send("Error deleting inventory: " + err.message);
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).send("Inventory record not found");
        }
  
        return res.status(200).send("Inventory deleted successfully");
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  const getNewArrivals = (req, res) => {
    const { days = 30 } = req.query; // Default to the last 30 days
  
    const query = `
      SELECT p.*, i.available_quantity, i.last_updated
      FROM Products p
      JOIN Inventory i ON p.product_id = i.product_id
      WHERE i.last_updated >= DATEADD(DAY, -${days}, GETDATE())
      ORDER BY i.last_updated DESC
    `;
  
    try {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          return res.status(500).send("Error fetching new arrivals: " + err.message);
        }
        return res.json(rows);
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };

  const getTopSellingProducts = (req, res) => {
    const { limit = 10 } = req.query; // Default to top 10 products
  
    const query = `
      SELECT p.product_id, p.name, 
        CONVERT(NVARCHAR(4000), p.description) AS description, 
        p.price, SUM(oi.quantity) AS total_sold
      FROM Products p
      JOIN Order_Items oi ON p.product_id = oi.product_id
      GROUP BY p.product_id, p.name, CONVERT(NVARCHAR(4000), p.description), p.price
      ORDER BY total_sold DESC
      OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY
    `;
  
    try {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          return res.status(500).send("Error fetching top selling products: " + err.message);
        }
        return res.json(rows);
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  module.exports = {
    createInventory,
    getInventories,
    updateInventory,
    deleteInventory,
    getNewArrivals,
    getTopSellingProducts
    // ... other exports
  };