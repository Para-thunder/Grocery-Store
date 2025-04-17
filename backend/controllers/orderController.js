const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");

// Create a new order
const createOrder = async (req, res) => {
  const { customer_id, items, payment_method } = req.body;

  try {
    const productPrices = await getProductPrices(items.map(item => item.product_id));
    const total_price = calculateTotalPrice(items, productPrices);

    sql.connect(connectionString, async (err, conn) => {
      if (err) return res.status(500).json({ error: "Database connection failed" });

      try {
        const orderResult = await insertOrder(conn, customer_id, total_price);
        await addOrderItems(conn, orderResult.order_id, items, productPrices);
        await createPayment(conn, orderResult.order_id, total_price, payment_method);
        await createDeliveryTracking(conn, orderResult.order_id);
        await updateInventory(conn, items);

        res.status(201).json({
          message: "Order created successfully",
          order: {
            order_id: orderResult.order_id,
            order_date: orderResult.order_date,
            total_price,
            status: 'Pending'
          }
        });
      } catch (error) {
        conn.rollback();
        res.status(500).json({ error: "Order creation failed", details: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Order processing failed", details: error.message });
  }
};

// Get all orders
const getAllOrders = (req, res) => {
  const query = `
    SELECT o.order_id, o.order_date, o.total_price, o.status,
           c.name AS customer_name, c.email AS customer_email,
           p.payment_method, p.payment_status,
           dt.delivery_status, dt.estimated_delivery_date
    FROM Orders o
    JOIN Customers c ON o.customer_id = c.customer_id
    LEFT JOIN Payments p ON o.order_id = p.order_id
    LEFT JOIN Delivery_Tracking dt ON o.order_id = dt.order_id
    ORDER BY o.order_date DESC
  `;

  sql.query(connectionString, query, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result.recordset);
  });
};

// Get order details
const getOrderDetails = (req, res) => {
  const orderId = req.params.id;
  
  const orderQuery = `
    SELECT o.*, c.name AS customer_name, c.email, c.address,
           p.payment_method, p.amount, p.payment_status, p.transaction_date,
           dt.delivery_status, dt.estimated_delivery_date, dt.actual_delivery_date,
           dt.courier_service, dt.tracking_number
    FROM Orders o
    JOIN Customers c ON o.customer_id = c.customer_id
    LEFT JOIN Payments p ON o.order_id = p.order_id
    LEFT JOIN Delivery_Tracking dt ON o.order_id = dt.order_id
    WHERE o.order_id = ?
  `;

  const itemsQuery = `
    SELECT oi.*, p.name AS product_name, p.description, c.category_name
    FROM Order_Items oi
    JOIN Products p ON oi.product_id = p.product_id
    JOIN Categories c ON p.category_id = c.category_id
    WHERE oi.order_id = ?
  `;

  sql.connect(connectionString, (err, conn) => {
    if (err) return res.status(500).json({ error: "Database connection failed" });

    conn.query(orderQuery, [orderId], (err, orderResult) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!orderResult.recordset.length) return res.status(404).json({ error: "Order not found" });

      conn.query(itemsQuery, [orderId], (err, itemsResult) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({
          order: orderResult.recordset[0],
          items: itemsResult.recordset
        });
      });
    });
  });
};

// Update order status
const updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const query = `
    UPDATE Orders
    SET status = ?
    WHERE order_id = ?
  `;

  sql.query(connectionString, query, [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (status === 'Cancelled') {
      restockCancelledOrderItems(orderId);
    }

    res.json({ message: "Order status updated successfully" });
  });
};

// Helper functions
const getProductPrices = async (productIds) => {
  return new Promise((resolve, reject) => {
    const placeholders = productIds.map(() => '?').join(',');
    const query = `
      SELECT product_id, price 
      FROM Products 
      WHERE product_id IN (${placeholders})
    `;
    
    sql.query(connectionString, query, productIds, (err, result) => {
      if (err) reject(err);
      resolve(result.recordset);
    });
  });
};

const calculateTotalPrice = (items, productPrices) => {
  return items.reduce((sum, item) => {
    const product = productPrices.find(p => p.product_id === item.product_id);
    return sum + (product.price * item.quantity);
  }, 0);
};

const insertOrder = async (conn, customer_id, total_price) => {
  return new Promise((resolve, reject) => {
    const orderQuery = `
      INSERT INTO Orders (customer_id, total_price, status)
      OUTPUT INSERTED.order_id, INSERTED.order_date
      VALUES (?, ?, 'Pending')
    `;
    conn.query(orderQuery, [customer_id, total_price], (err, result) => {
      if (err) reject(err);
      resolve(result.recordset[0]);
    });
  });
};



module.exports = {
  createOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
};
