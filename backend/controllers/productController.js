const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");
const Product = require("../models/Product"); // Adjust the path to your Product model
const Category = require("../models/Category"); // Adjust the path to your Category model
// Adjust the path to your Inventory model
const { sequelize } = require('../models'); // Adjust the path to your sequelize instance 
const { Op } = require('sequelize');
const getProducts = (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT p.*, c.category_name, i.available_quantity 
    FROM Products p
    JOIN Categories c ON p.category_id = c.category_id
    JOIN Inventory i ON p.product_id = i.product_id
    ORDER BY p.product_id
    OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
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

  sql.query(connectionString, productSql, [productId], (err, result) => {
    if (err) {
      console.error("Error fetching product by ID:", err);
      return res.status(500).json({ message: "Failed to get product", error: err.message });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result[0]); // Return the first (and only) product
  });
};
const searchProductsByName = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Product name is required for search' });
  }

  const query = `
    SELECT p.*, c.category_name, i.available_quantity 
    FROM Products p
    JOIN Categories c ON p.category_id = c.category_id
    JOIN Inventory i ON p.product_id = i.product_id
    WHERE p.name LIKE '%' + ? + '%'
  `;

  sql.query(connectionString, query, [name], (err, rows) => {
    if (err) {
      console.error("Error searching products:", err);
      return res.status(500).json({ 
        error: "Failed to search products", 
        details: err.message 
      });
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        message: "No products found matching the search term" 
      });
    }

    return res.json(rows);
  });
};
const filterByPrice = (req, res) => {
  const { minPrice = 0, maxPrice = Number.MAX_VALUE } = req.query; // Default to no price limit

  const query = `
    SELECT p.*, c.category_name, i.available_quantity 
    FROM Products p
    JOIN Categories c ON p.category_id = c.category_id
    JOIN Inventory i ON p.product_id = i.product_id
    WHERE p.price BETWEEN ? AND ?
    ORDER BY p.price ASC
  `;

  sql.query(connectionString, query, [minPrice, maxPrice], (err, rows) => {
    if (err) {
      console.error("Error filtering products by price:", err);
      return res.status(500).json({ 
        error: "Failed to filter products by price", 
        details: err.message 
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({ 
        message: "No products found in the specified price range" 
      });
    }

    return res.json(rows);
  });
};
const getDeal = (req, res) => {
  const { productIds } = req.query;
  let { discountPercentage } = req.query;

  // Set default discount to 20% if not provided
  discountPercentage = discountPercentage ? parseFloat(discountPercentage) : 20;

  // Validate input
  if (!productIds || productIds.split(',').length !== 3) {
    return res.status(400).json({ error: "Exactly three product IDs are required to get a deal" });
  }

  if (discountPercentage <= 0 || discountPercentage > 100) {
    return res.status(400).json({ error: "A valid discount percentage (1-100) is required" });
  }

  const productIdsArray = productIds.split(',').map(id => parseInt(id.trim()));

  const query = `
    SELECT p.product_id, p.name, p.price
    FROM Products p
    WHERE p.product_id IN (?, ?, ?)
  `;

  sql.query(connectionString, query, productIdsArray, (err, rows) => {
    if (err) {
      console.error("Error fetching products for deal:", err);
      return res.status(500).json({ error: "Failed to fetch deal", details: err.message });
    }

    if (rows.length !== 3) {
      return res.status(404).json({ error: "One or more product IDs are invalid" });
    }

    // Calculate the total price and apply the discount
    const totalPrice = rows.reduce((sum, product) => sum + product.price, 0);
    const discountedPrice = totalPrice - (totalPrice * (discountPercentage / 100));

    const deal = {
      products: rows,
      totalPrice: totalPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      discountPercentage,
    };

    return res.status(200).json(deal);
  });
};
// Export all functions as an object
module.exports = {
  deleteProduct,
  updateProduct,
  createProduct,
  getProducts,
  searchProductsByName,
  filterByPrice,
  getDeal
};