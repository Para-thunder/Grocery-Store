const jwt = require('jsonwebtoken');
const { Customer } = require('../models/Customer'); // Import the Customer model correctly
const {Cart} = require('../models/Cart');
const { Order } = require('../models/Order'); // Import the Order model correctly
const { OrderItem } = require('../models/OrderItem'); // Import the OrderItem model correctly 
const { Product } = require('../models/Product'); // Import the Product model correctly
const { sequelize } = require('../models'); // Import sequelize instance correctly
const { findCustomerByEmail } = require('../controllers/customerController');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token);

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Fetch the customer from the database using your existing function
    const customer = await findCustomerByEmail(decoded.email);
    if (!customer) {
      return res.status(401).json({ error: 'Invalid token - customer not found' });
    }

    // Attach customer details to the request object
    req.customer = {
      customerId: customer.customer_id,
      email: customer.email,
      name: customer.name,
      role: customer.role,
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
const adminOnly = (req, res, next) => {
  if (!req.customer || req.customer.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

module.exports = {
  authenticate,
  adminOnly,
};