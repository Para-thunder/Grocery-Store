const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");

// Get all categories
const getCategory = (req, res) => {
    const query = "SELECT * FROM Categories";
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
  const createCategory = (req, res) => {
    const { category_name } = req.body;
  
    if (!category_name) {
      return res.status(400).send("category_name is required.");
    }
  
    const query = `
      INSERT INTO Categories (category_name)
      VALUES ('${category_name}')
    `;
  
    try {
      sql.query(connectionString, query, (err, result) => {
        if (err) {
          return res.status(500).send("Error creating category: " + err.message);
        }
        return res.status(201).send("Category created successfully");
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  const updateCategory = (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;
  
    if (!category_name) {
      return res.status(400).send("category_name is required.");
    }
  
    const query = `
      UPDATE Categories
      SET category_name = '${category_name}'
      WHERE category_id = ${id}
    `;
  
    try {
      sql.query(connectionString, query, (err, result) => {
        if (err) {
          return res.status(500).send("Error updating category: " + err.message);
        }
  
        return res.status(200).send("Category updated successfully");
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  const deleteCategory = (req, res) => {
    const { id } = req.params;
  
    const query = `
      DELETE FROM Categories
      WHERE category_id = ${id}
    `;
  
    try {
      sql.query(connectionString, query, (err, result) => {
        if (err) {
          return res.status(500).send("Error deleting category: " + err.message);
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).send("Category not found");
        }
  
        return res.status(200).send("Category deleted successfully");
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  };
  
  module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
    // ... other exports
  };