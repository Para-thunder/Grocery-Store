const jwt = require('jsonwebtoken');
const db = require('../models/Index'); // Import models correctly

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await db.Customer.findByPk(decoded.customerId);
    
    if (!customer) {
      return res.status(401).json({ error: 'Invalid token - customer not found' });
    }

    req.customer = {
      customerId: customer.customer_id,
      email: customer.email,
      name: customer.name,
      role: customer.role
    };
    
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.customer || req.customer.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

module.exports = { 
  authenticate, 
  adminOnly 
};