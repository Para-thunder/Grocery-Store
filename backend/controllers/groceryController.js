const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");



// Get all products
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


// Get all Orders
const getOrders = (req, res) => {
  const query = `
    SELECT o.*, p.name AS product_name, p.price
    FROM Order_Items o
    JOIN Products p ON o.product_id = p.product_id
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

const createOrder = (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).send("Product ID and quantity are required");
  }

  const query = `
    INSERT INTO Orders (product_id, quantity, order_date)
    VALUES (?, ?, GETDATE())
  `;

  sql.query(connectionString, query, [product_id, quantity], (err, result) => {
    if (err) {
      return res.status(500).send("Error creating order: " + err.message);
    }

    return res.status(201).send("Order created successfully");
  });
};

const deleteOrder = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM Orders
    WHERE order_id = ${id}
  `;

  try {
    sql.query(connectionString, query, (err, result) => {
      if (err) {
        return res.status(500).send("Error deleting order: " + err.message);
      }

      if (result.rowsAffected && result.rowsAffected[0] === 0) {
        return res.status(404).send("Order not found");
      }

      return res.status(200).send("Order deleted successfully");
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const updateOrder = (req, res) => {
  const { id } = req.params;
  const { product_id, quantity } = req.body;

  if (!product_id || quantity === undefined) {
    return res.status(400).send("Both product_id and quantity are required");
  }

  const query = `
    UPDATE Orders
    SET product_id = ${product_id}, quantity = ${quantity}
    WHERE order_id = ${id}
  `;

  try {
    sql.query(connectionString, query, (err, result) => {
      if (err) {
        return res.status(500).send("Error updating order: " + err.message);
      }

      if (result.rowsAffected && result.rowsAffected[0] === 0) {
        return res.status(404).send("Order not found");
      }

      return res.status(200).send("Order updated successfully");
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

const updatePayment = async (req, res) => {
  const { order_id, payment_method, amount, payment_status } = req.body;

  try {
    const pool = await sql.connect(); // Ensure sql is properly configured
    await pool.request()
      .input('order_id', sql.Int, order_id)
      .input('payment_method', sql.VarChar(50), payment_method)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('payment_status', sql.VarChar(50), payment_status || 'Pending')
      .query(`
        INSERT INTO Payments (order_id, payment_method, amount, payment_status)
        VALUES (@order_id, @payment_method, @amount, @payment_status)
      `);

    res.status(201).json({ message: 'Payment recorded successfully' });
  } catch (err) {
    console.error('Error inserting payment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getPayment = async (req, res) => {
  const { orderId } = req.params;

  const query = `
    SELECT * FROM Payments WHERE order_id = @orderId
  `;

  try {
    // Connect to the database using mssql and await connection
    const pool = await sql.connect(connectionString);

    // Use parameterized queries with await
    const result = await pool.request()
      .input('orderId', sql.Int, orderId)  // Bind the parameter to the query
      .query(query);

    // If no payment is found for the provided orderId
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Payment not found for the given orderId' });
    }

    // Respond with the result (payments)
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching payment:', err);  // Log error details
    res.status(500).json({ error: 'Internal server error', details: err.message });  // Return the error message
  }
};

const getDelivery = async (req, res) => {
  const { orderId } = req.params;
  
  console.log(`Fetching delivery for order ID: ${orderId}`); // Debug log

  const query = `
    SELECT 
      dt.tracking_id,
      dt.delivery_status,
      dt.estimated_delivery_date,
      dt.actual_delivery_date,
      dt.courier_service,
      dt.tracking_number,
      o.order_id,
      o.order_date
    FROM Delivery_Tracking dt
    JOIN Orders o ON dt.order_id = o.order_id
    WHERE dt.order_id = ?
  `;

  try {
    console.log("Executing query:", query); // Debug log
    
    sql.query(connectionString, query, [orderId], (err, rows) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ 
          error: "Database error",
          details: err.message 
        });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ 
          message: 'No delivery record found for this order ID' 
        });
      }

      console.log("Query results:", rows); // Debug log
      res.status(200).json(rows[0]);
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ 
      error: "Internal server error",
      details: err.message 
    });
  }
};


module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategory,
  deleteCategory,
  updateCategory,
  createCategory,
  getInventories,
  getOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  deleteInventory,
  updateInventory,
  createInventory,
  getPayment,
  updatePayment,
  getDelivery,
};