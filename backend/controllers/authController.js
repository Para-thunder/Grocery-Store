const CustomerService = require('../services/customerService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createCustomer } = require('./customerController'); // Import the createCustomer function

const register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !address) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Call the createCustomer function to insert the customer into the database
    await createCustomer(req, res);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register customer', details: error.message });
  }
};

/* const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await CustomerService.findCustomerByEmail(email);
    
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { customerId: customer.customer_id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      customerId: customer.customer_id,
      name: customer.name,
      email: customer.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    const customer = await CustomerService.findCustomerByEmail(req.customer.email);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */


const getCustomerProfile = async (req, res) => {
  try {
    // Since authenticate middleware already attached customer info
    // We can just return it or fetch fresh data if needed
    if (!req.customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Option 1: Return what's already in req.customer
    res.json(req.customer);
    
    // OR Option 2: Fetch fresh data from database
    /*
    const customer = await findCustomerByEmail(req.customer.email);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({
      customerId: customer.customer_id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      role: customer.role,
      createdAt: customer.created_at,
    });
    */
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await findCustomerByEmail(email);
    
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { customerId: customer.customer_id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      customerId: customer.customer_id,
      name: customer.name,
      email: customer.email
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
};
const { findCustomerByEmail } = require('./customerController'); // Import the findCustomerByEmail function

/* const getCustomerProfile = async (req, res) => {
  try {
    const customer = await findCustomerByEmail(req.customer.email);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({
      customerId: customer.customer_id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      role: customer.role,
      createdAt: customer.created_at,
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ error: error.message });
  }
}; */
module.exports = {
  register,
  login,
  getCustomerProfile
};