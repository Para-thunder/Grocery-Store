const { Cart, Product } = require('../models/Index');

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
    const customerId = req.customer.customerId;
    const cartItems = await getFullCart(customerId);
    
    // Handle empty cart case
    if (!cartItems || cartItems.length === 0) {
      return res.json({
        customerId,
        items: [],
        itemCount: 0,
        total: 0
      });
    }

    const response = {
      customerId,
      items: cartItems.map(item => ({
        cartId: item.cart_id,
        product: {
          productId: item.Product.product_id,
          name: item.Product.name,
          price: item.Product.price,
          description: item.Product.description,
          stock: item.Product.stock_quantity
        },
        quantity: item.quantity,
        addedAt: item.added_at
      })),
      itemCount: cartItems.length,
      total: cartItems.reduce((sum, item) => sum + (item.Product.price * item.quantity), 0)
    };

    res.json(response);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: 'Failed to get cart', details: error.message });
  }
};

const addToCart = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start transaction
  try {
    const { productId, quantity = 1 } = req.body;
    const customerId = req.customer.customerId;

    if (!productId || quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Check product exists and has stock (with lock for concurrency)
    const product = await Product.findByPk(productId, {
      transaction,
      lock: transaction.LOCK.UPDATE
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
      where: { user_id: customerId, product_id: productId },
      defaults: { quantity },
      transaction
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save({ transaction });
    }

    // Update product stock
    product.stock_quantity -= quantity;
    await product.save({ transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Product added to cart',
      cartItem: {
        cartId: cartItem.cart_id,
        productId: cartItem.product_id,
        quantity: cartItem.quantity
      },
      remainingStock: product.stock_quantity
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Add to cart error:", error);
    res.status(500).json({ 
      error: 'Failed to add to cart',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getCart, addToCart };