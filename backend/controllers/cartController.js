const sql = require('mssql');
const connectionString = require('../config/connectDB');

// Helper function to calculate cart total
const calculateTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user?.user_id || 1;

    // 1. Verify product exists and get price
    const product = await getProductDetails(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Check current cart item
    const cartItem = await getCartItem(userId, product_id);
    
    // 3. Add or update item in cart
    if (cartItem) {
      await updateCartItem(userId, product_id, cartItem.quantity + quantity);
    } else {
      await addNewCartItem(userId, product_id, quantity);
    }

    // 4. Return updated cart
    const updatedCart = await getFullCart(userId);
    res.json({
      message: "Item added to cart",
      cart: updatedCart.items,
      total: updatedCart.total
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cart item quantity
const updateCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user?.user_id || 1;

    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    // Check if item exists in cart
    const cartItem = await getCartItem(userId, product_id);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update quantity
    await updateCartItem(userId, product_id, quantity);

    // Return updated cart
    const updatedCart = await getFullCart(userId);
    res.json({
      message: "Cart updated",
      cart: updatedCart.items,
      total: updatedCart.total
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get full cart with calculated total
const getCart = async (req, res) => {
  try {
    const userId = req.user?.user_id || 1;
    const cart = await getFullCart(userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.body;
    const userId = req.user?.user_id || 1;

    const deleteQuery = `DELETE FROM Cart WHERE user_id = @userId AND product_id = @productId`;
    await sql.connect(connectionString);
    const request = new sql.Request();
    request.input('userId', sql.Int, userId);
    request.input('productId', sql.Int, product_id);
    
    const result = await request.query(deleteQuery);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const updatedCart = await getFullCart(userId);
    res.json({
      message: "Item removed from cart",
      cart: updatedCart.items,
      total: updatedCart.total
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== Helper Functions ====================

const getProductDetails = async (productId) => {
  const query = `SELECT product_id, price FROM Products WHERE product_id = @productId`;
  await sql.connect(connectionString);
  const request = new sql.Request();
  request.input('productId', sql.Int, productId);
  const result = await request.query(query);
  return result.recordset[0] || null;
};

const getCartItem = async (userId, productId) => {
  const query = `SELECT * FROM Cart WHERE user_id = @userId AND product_id = @productId`;
  await sql.connect(connectionString);
  const request = new sql.Request();
  request.input('userId', sql.Int, userId);
  request.input('productId', sql.Int, productId);
  const result = await request.query(query);
  return result.recordset[0] || null;
};

const addNewCartItem = async (userId, productId, quantity) => {
  const query = `
    INSERT INTO Cart (user_id, product_id, quantity)
    VALUES (@userId, @productId, @quantity)
  `;
  await sql.connect(connectionString);
  const request = new sql.Request();
  request.input('userId', sql.Int, userId);
  request.input('productId', sql.Int, productId);
  request.input('quantity', sql.Int, quantity);
  await request.query(query);
};

const updateCartItem = async (userId, productId, quantity) => {
  const query = `
    UPDATE Cart SET quantity = @quantity
    WHERE user_id = @userId AND product_id = @productId
  `;
  await sql.connect(connectionString);
  const request = new sql.Request();
  request.input('userId', sql.Int, userId);
  request.input('productId', sql.Int, productId);
  request.input('quantity', sql.Int, quantity);
  await request.query(query);
};

const getFullCart = async (userId) => {
  const query = `
    SELECT 
      c.product_id, 
      p.name, 
      p.price, 
      p.image_url,
      c.quantity, 
      (p.price * c.quantity) as subtotal
    FROM Cart c
    JOIN Products p ON c.product_id = p.product_id
    WHERE c.user_id = @userId
  `;
  
  await sql.connect(connectionString);
  const request = new sql.Request();
  request.input('userId', sql.Int, userId);
  const result = await request.query(query);
  
  return {
    items: result.recordset,
    total: calculateTotalPrice(result.recordset)
  };
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  calculateTotalPrice
};