const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");

const getProducts = (req, res) => {
  const query = `
    SELECT p.*, c.category_name, i.available_quantity 
    FROM Products p
    JOIN Categories c ON p.category_id = c.category_id
    JOIN Inventory i ON p.product_id = i.product_id
  `;

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

// Create new product
const createProduct = async (req, res) => {
  const { name, description, price, category_id, stock_quantity } = req.body;

  if (!name || !price || !category_id || stock_quantity === undefined) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    // 1. Check if category exists
    const categoryCheck = await new Promise((resolve, reject) => {
      sql.query(connectionString, 
        "SELECT 1 FROM Categories WHERE category_id = ?", 
        [category_id], 
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (!categoryCheck || categoryCheck.length === 0) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // 2. Create product and get its ID
    const productQuery = `
      INSERT INTO Products (name, description, price, category_id, stock_quantity)
      OUTPUT INSERTED.product_id
      VALUES (?, ?, ?, ?, ?)
    `;

    const productResult = await new Promise((resolve, reject) => {
      sql.query(connectionString, 
        productQuery, 
        [name, description || null, price, category_id, stock_quantity], 
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const productId = productResult[0].product_id;

    // 3. Create inventory record
    const inventoryQuery = `
      INSERT INTO Inventory (product_id, available_quantity)
      VALUES (?, ?)
    `;

    await new Promise((resolve, reject) => {
      sql.query(connectionString, 
        inventoryQuery, 
        [productId, stock_quantity], 
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return res.status(201).json({ 
      success: true,
      productId: productId,
      message: "Product created successfully"
    });

  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ 
      error: "Failed to create product",
      details: err.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id, stock_quantity } = req.body;

  const query = `
    UPDATE Products
    SET name = '${name}',
        description = '${description}',
        price = ${price},
        category_id = ${category_id},
        stock_quantity = ${stock_quantity}
    WHERE product_id = ${id}
  `;

  try {
    sql.query(connectionString, query, (err, result) => {
      if (err) {
        return res.status(500).send("Error updating product: " + err.message);
      }
      return res.status(200).send("Product updated successfully");
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // First, delete from Inventory to handle foreign key constraints
  const deleteInventoryQuery = `
    DELETE FROM Inventory 
    WHERE product_id = ${id}
  `;

  // Then delete from Products
  const deleteProductQuery = `
    DELETE FROM Products 
    WHERE product_id = ${id}
  `;

  try {
    // First, delete from Inventory
    sql.query(connectionString, deleteInventoryQuery, (err, inventoryResult) => {
      if (err) {
        return res.status(500).send("Error deleting inventory record: " + err.message);
      }

      // Then delete from Products
      sql.query(connectionString, deleteProductQuery, (err, productResult) => {
        if (err) {
          return res.status(500).send("Error deleting product: " + err.message);
        }

        // Check if any rows were affected
        if (productResult.affectedRows === 0) {
          return res.status(404).send("Product not found");
        }

        return res.status(200).send("Product deleted successfully");
      });
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};
const getProductById = (req, res) => {
  const productId = req.params.id;
  
  const productSql = `
      SELECT p.*, c.category_name 
      FROM Products p
      JOIN Categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
  `;
  
  sql.connect(connectionString, (err, conn) => {
      if (err) return res.status(500).json({ message: "DB error", err });
      
      conn.query(productSql, [productId], (err, result) => {
          if (err) return res.status(500).json({ message: "Failed to get product", err });
          
          if (result.recordset.length === 0) {
              return res.status(404).json({ message: "Product not found" });
          }
          
          res.json(result.recordset[0]);
      });
  });
};

// Export all functions as an object
module.exports = {
  deleteProduct,
  updateProduct,
  createProduct,
  getProducts,
  getProductById
};