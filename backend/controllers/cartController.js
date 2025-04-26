const Cart = require('../models/Cart');
const Product = require("../models/Product");
const { sequelize } = require('../models/index'); // Import sequelize instance correctly

// Add a product to the cart
const addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // Check if the product already exists in the cart
    const existingCartItem = await Cart.findOne({
      where: { user_id, product_id },
    });

    if (existingCartItem) {
      // Update the quantity if the product already exists
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Cart updated successfully', cart: existingCartItem });
    }

    // Add a new product to the cart
    const cartItem = await Cart.create({ user_id, product_id, quantity });
    return res.status(201).json({ message: 'Product added to cart', cart: cartItem });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return res.status(500).json({ error: 'Failed to add product to cart', details: err.message });
  }
};

// Get all cart items for a user
const getCartItems = async (req, res) => {
  const { user_id } = req.params;

  try {
    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'price', 'description'],
        },
      ],
    });

    return res.status(200).json(cartItems);
  } catch (err) {
    console.error('Error fetching cart items:', err);
    return res.status(500).json({ error: 'Failed to fetch cart items', details: err.message });
  }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const cartItem = await Cart.findOne({
      where: { user_id, product_id },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    await cartItem.destroy();
    return res.status(200).json({ message: 'Product removed from cart' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    return res.status(500).json({ error: 'Failed to remove product from cart', details: err.message });
  }
};

// Update the quantity of a product in the cart
const updateCartQuantity = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    const cartItem = await Cart.findOne({
      where: { user_id, product_id },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    return res.status(200).json({ message: 'Cart quantity updated successfully', cart: cartItem });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    return res.status(500).json({ error: 'Failed to update cart quantity', details: err.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
};