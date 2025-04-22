const jwt = require('jsonwebtoken');
const { Customer } = require('../models/Index'); // Import the Customer model correctly



/* const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token); // Debug log

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    // Fetch the customer from the database
    const customer = await Customer.findByPk(decoded.customerId);
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
}; */


//const jwt = require('jsonwebtoken');
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