// Replace all individual model imports with this:
const { 
  sequelize,
  Order,
  OrderItem,
  Product,
  Customer 
} = require('../models');
const { getProductPrices } = require('../utils/productUtils');
const { calculateTotalPrice, validateStock } = require('../utils/orderUtils'); // Fixed import

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { customer_id, items, payment_method, shipping_address } = req.body;

    // 1. Input Validation
    if (!customer_id || !items || !payment_method || !shipping_address) {
      await transaction.rollback();
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // 2. Get product prices and stock using utility
    const productIds = items.map(item => item.product_id);
    const priceMap = await getProductPrices(productIds);

    // 3. Verify all products exist
    const missingIds = productIds.filter(id => !priceMap[id]);
    if (missingIds.length > 0) {
      await transaction.rollback();
      return res.status(404).json({ 
        error: "Some products not found",
        missing_product_ids: missingIds
      });
    }

    // 4. Check stock using utility
    try {
      validateStock(items, priceMap); // Now properly imported
    } catch (stockError) {
      await transaction.rollback();
      return res.status(400).json({
        error: stockError.message,
        items: stockError.cause || [] // Handle case where cause might be undefined
      });
    }

    // 5. Calculate total using utility
    const total_amount = calculateTotalPrice(items, priceMap);

    // 6. Create the order
    const order = await Order.create({
      customer_id,
      total_amount,
      payment_method,
      shipping_address,
      status: 'pending',
      order_date: new Date()
    }, { transaction });

    // 7. Create order items
    const orderItems = items.map(item => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: priceMap[item.product_id].price
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    // 8. Update product quantities
    const updatePromises = items.map(item => 
      Product.decrement('stock_quantity', {
        by: item.quantity,
        where: { product_id: item.product_id },
        transaction
      })
    );
    await Promise.all(updatePromises);

    await transaction.commit();

    return res.status(201).json({
      success: true,
      order: {
        ...order.get({ plain: true }),
        items: orderItems
      },
      message: "Order created successfully"
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Order creation error:", error);
    return res.status(500).json({ 
      error: "Failed to create order",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { customer_id, items, payment_method, shipping_address } = req.body;

    // 1. Input Validation
    if (!customer_id || !items || !payment_method || !shipping_address) {
      await transaction.rollback();
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // 2. Get product prices and stock using utility
    const productIds = items.map(item => item.product_id);
    const priceMap = await getProductPrices(productIds);

    // 3. Verify all products exist
    const missingIds = productIds.filter(id => !priceMap[id]);
    if (missingIds.length > 0) {
      await transaction.rollback();
      return res.status(404).json({ 
        error: "Some products not found",
        missing_product_ids: missingIds
      });
    }

    // 4. Check stock using utility
    try {
      validateStock(items, priceMap);
    } catch (stockError) {
      await transaction.rollback();
      return res.status(400).json({
        error: stockError.message,
        items: stockError.cause
      });
    }

    // 5. Calculate total using utility
    const total_amount = calculateTotalPrice(items, priceMap);

    // 6. Create the order
    const order = await Order.create({
      customer_id,
      total_amount,
      payment_method,
      shipping_address,
      status: 'pending',
      order_date: new Date()
    }, { transaction });

    // 7. Create order items
    const orderItems = items.map(item => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: priceMap[item.product_id].price
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    // 8. Update product quantities
    for (const item of items) {
      await Product.decrement('stock_quantity', {
        by: item.quantity,
        where: { product_id: item.product_id },
        transaction
      });
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      order: {
        ...order.get({ plain: true }),
        items: orderItems
      },
      message: "Order created successfully"
    });

  } catch (error) {
    await transaction.rollback();
    console.error("Order creation error:", error);
    return res.status(500).json({ 
      error: "Failed to create order",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; */

// [Keep your existing getOrderDetails, updateOrderStatus, and getAllOrders functions]

// Get order details
const getOrderDetails = async (req, res) => {
  const { id } = req.params; // Extract id directly

  // Debugging: Log the id
  console.log("Order ID received:", id);

  if (!id) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const order = await Order.findOne({
      where: { order_id: id }, // Use id here
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name', 'email', 'address'],
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'description', 'price'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order details:", err);
    return res.status(500).json({ error: "Failed to fetch order details", details: err.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Order.findOne({
      where: { order_id: req.params.id },
      transaction
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If cancelling, we might want to restock items
    if (req.body.status === 'cancelled' && order.status !== 'cancelled') {
      // Implement restock logic if needed
    }

    order.status = req.body.status;
    await order.save({ transaction });
    
    await transaction.commit();

    return res.status(200).json({ 
      message: "Order status updated successfully", 
      order 
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating order status:", err);
    return res.status(500).json({ 
      error: "Failed to update order status", 
      details: err.message 
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name', 'email', 'address'], // Include customer details
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'description', 'price'], // Include product details
            },
          ],
        },
      ],
      order: [['order_date', 'DESC']], // Sort orders by date in descending order
    });

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({
      error: "Failed to fetch orders",
      details: err.message,
    });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
};