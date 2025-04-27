const CustomerService = require('../services/customerService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createCustomer } = require('./customerController'); // Import the createCustomer function
//const { findCustomerByEmail } = require('./customerController'); // Import the findCustomerByEmail functio
const connectionString  = require('../config/connectDB'); // Import your database connection string
const sql = require('msnodesqlv8');
const { sequelize } = require('../models'); // Import sequelize instance correctly
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


const getCustomerProfile = async (req, res) => {
  try {
    // Ensure the customer is attached by the authenticate middleware
    if (!req.customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Fetch fresh data from the database
    const customer = await findCustomerByEmail(req.customer.email);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Respond with the required fields
    res.json({
      customerId: customer.customer_id,
      email: customer.email,
      name: customer.name,
      address: customer.address,
      createdAt: customer.created_at,
      role: customer.role, // Include role if needed
    });
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
      { expiresIn: '24h' }
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
const { findCustomerByEmail,findCustomerByEmail1 } = require('./customerController'); // Import the findCustomerByEmail function

const updateCustomerProfile = async (req, res) => {
  try {
    if (!req.customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const { name, email, address, password } = req.body;
    const currentEmail = req.customer.email;

    if (!name && !email && !address && !password) {
      return res.status(400).json({ error: 'At least one field must be provided to update' });
    }

    // Fetch the customer first
    const customer = await findCustomerByEmail(currentEmail);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Build the update query dynamically
    let updates = [];
    let params = [];
    
    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email.toLowerCase());
    }
    if (address) {
      updates.push('address = ?');
      params.push(address);
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.push('password_hash = ?');
      params.push(hashedPassword);
    }

    // Add current email as the WHERE parameter
    params.push(currentEmail);

    const updateQuery = `
      UPDATE Customers 
      SET ${updates.join(', ')} 
      WHERE email = ?
    `;

    await new Promise((resolve, reject) => {
      sql.query(connectionString, updateQuery, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Fetch the updated customer
    const updatedCustomer = await findCustomerByEmail(email || currentEmail);
    
    res.json({
      message: 'Profile updated successfully',
      customer: {
        customerId: updatedCustomer.customer_id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        address: updatedCustomer.address,
      },
    });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};
module.exports = {
  register,
  login,
  getCustomerProfile,
  updateCustomerProfile
};