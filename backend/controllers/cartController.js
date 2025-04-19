const { Cart, Product ,sequelize } = require('../models/Index');
//const { format } = require('date-fns'); // Ensure date-fns is installed

const getFullCart = async (customerId) => {
  try {
    return await Cart.findAll({ 
      where: { user_id: customerId },
      include: [{
        model: Product,
        attributes: ['product_id', 'name', 'price', 'description', 'stock_quantity']
      }],
      attributes: ['cart_id', 'quantity', 'added_at'],
      raw: false // Ensure we get full model instances
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};
const getCart = async (req, res) => {
  try {
    const customerId = req.customer.customerId; // Extract customerId from the token
    console.log('Fetching cart for customerId:', customerId); // Debug log

    const cartItems = await Cart.findAll({
      where: { user_id: customerId },
      include: [
        {
          model: Product,
          as: 'product', // Specify the alias used in the association
          attributes: ['product_id', 'name', 'price', 'description', 'stock_quantity'],
        },
      ],
      attributes: ['cart_id', 'quantity', 'added_at'],
    });

    // Handle empty cart case
    if (!cartItems || cartItems.length === 0) {
      return res.json({
        customerId,
        items: [],
        itemCount: 0,
        total: 0,
      });
    }

    // Prepare the response
    const response = {
      customerId,
      items: cartItems.map((item) => ({
        cartId: item.cart_id,
        product: {
          productId: item.product.product_id, // Use the alias here as well
          name: item.product.name,
          price: item.product.price,
          description: item.product.description,
          stock: item.product.stock_quantity,
        },
        quantity: item.quantity,
        addedAt: item.added_at,
      })),
      itemCount: cartItems.length,
      total: cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    };

    res.json(response);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart', details: error.message });
  }
};

const addToCart = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const { productId, quantity = 1 } = req.body;
    const customerId = req.customer.customerId;

    // Validate input
    if (!productId || quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Check product existence and stock with proper lock
    const product = await Product.findByPk(productId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Insufficient stock', 
        available: product.stock_quantity 
      });
    }

    // Add or update cart item
    const [cartItem, created] = await Cart.findOrCreate({
      where: { 
        user_id: customerId, 
        product_id: productId 
      },
      defaults: {
        user_id: customerId,
        product_id: productId,
        quantity: quantity
      },
      transaction,
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save({ transaction });
    }

    // Update product stock
    product.stock_quantity -= quantity;
    await product.save({ transaction });

    await transaction.commit();

    // Get fresh cart item with proper timestamp
    const updatedCartItem = await Cart.findByPk(cartItem.cart_id, {
      include: [{
        model: Product,
        as: 'product', // Ensure this matches the alias in the association
        attributes: ['product_id', 'name', 'price']
      }]
    });

    // Null check for associated product
    if (!updatedCartItem || !updatedCartItem.product) {
      return res.status(500).json({
        error: 'Failed to fetch updated cart item',
        details: 'Associated product data is missing'
      });
    }

    res.status(201).json({
      message: 'Product added to cart',
      cartItem: {
        cartId: updatedCartItem.cart_id,
        productId: updatedCartItem.product_id,
        productName: updatedCartItem.product.name,
        price: updatedCartItem.product.price,
        quantity: updatedCartItem.quantity,
        addedAt: updatedCartItem.added_at // Now shows proper server-generated timestamp
      },
      remainingStock: product.stock_quantity,
    });

  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Add to cart error:', error);
    res.status(500).json({
      error: 'Failed to add to cart',
      details: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.body; // Extract cartId from the request body
    const { quantity } = req.body;
    const customerId = req.customer.customerId; // Extract customerId from the token

    if (!cartId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid cartId or quantity' });
    }

    // Find the cart item and ensure it belongs to the authenticated user
    const cartItem = await Cart.findOne({
      where: { cart_id: cartId, user_id: customerId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      message: 'Cart item updated successfully',
      cartItem: {
        cartId: cartItem.cart_id,
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        addedAt: cartItem.added_at,
      },
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item', details: error.message });
  }
};
const deleteCartItem = async (req, res) => {
  try {
    const { cartId } = req.body; // Extract cartId from the request body
    const customerId = req.customer.customerId; // Extract customerId from the token

    if (!cartId) {
      return res.status(400).json({ error: 'Invalid cartId' });
    }

    // Find the cart item and ensure it belongs to the authenticated user
    const cartItem = await Cart.findOne({
      where: { cart_id: cartId, user_id: customerId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Delete the cart item
    await cartItem.destroy();

    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item', details: error.message });
  }
};

module.exports = { getFullCart,getCart, addToCart, updateCartItem, deleteCartItem }; 




