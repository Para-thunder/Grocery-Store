const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");

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
  module.exports = {
    createInventory,
    getInventories,
    updateInventory,
    deleteInventory
    // ... other exports
  };