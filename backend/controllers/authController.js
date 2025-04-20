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
/* const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Create a new customer
    const newCustomer = await CustomerService.createCustomer({
      name,
      email,
      password,
      address,
    });

    res.status(201).json({
      customerId: newCustomer.customer_id,
      name: newCustomer.name,
      email: newCustomer.email,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ error: error.message });
  }
}; */
const login = async (req, res) => {
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
};

module.exports = {
  register,
  login,
  getCustomerProfile
};