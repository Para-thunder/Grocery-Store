const { Customer } = require('../models/Index');
const bcrypt = require('bcrypt');
const { ValidationError } = require('sequelize');

class CustomerService {
  /**
   * Creates a new customer with password hashing
   */
  static async createCustomer(customerData) {
    try {
      // Validate required fields
      if (!customerData.name || !customerData.email || !customerData.password || !customerData.address) {
        throw new Error('Name, email, password, and address are required');
      }
  
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(customerData.password, saltRounds);
  
      // Create a new customer
      const newCustomer = await Customer.create({
        name: customerData.name,
        email: customerData.email.toLowerCase(),
        password_hash: passwordHash,
        address: customerData.address,
        role: customerData.role || 'customer',
        created_at: new Date(),
      });
  
      return {
        customer_id: newCustomer.customer_id,
        name: newCustomer.name,
        email: newCustomer.email,
        address: newCustomer.address,
        role: newCustomer.role,
        created_at: newCustomer.created_at,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = error.errors.map((err) => err.message);
        throw new Error(`Validation error: ${messages.join(', ')}`);
      }
  
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email address already in use');
      }
  
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Finds customer by email with cart information
   */
  static async findCustomerByEmail(email, includeCart = true) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const options = {
        where: { email: email.toLowerCase() },
        attributes: {
          //exclude: ['password_hash'] // Never return password hash
          exclude: [] 
        }
      };

   if (includeCart) {
        options.include = [{
          association: 'carts',
          attributes: ['cart_id', 'product_id', 'quantity', 'added_at']
        }];
      }

      const customer = await Customer.findOne(options);

      if (!customer) {
        throw new Error('Customer not found');
      }

      return customer;

    } catch (error) {
      throw new Error(`Failed to find customer: ${error.message}`);
    }
  }

  /**
   * Verifies customer credentials
   */
  static async verifyCredentials(email, password) {
    try {
      const customer = await Customer.findOne({
        where: { email: email.toLowerCase() },
        attributes: ['customer_id', 'email', 'password_hash', 'role']
      });

      if (!customer) {
        throw new Error('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, customer.password_hash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Return customer data without password
      return {
        customer_id: customer.customer_id,
        email: customer.email,
        role: customer.role
      };

    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }
}

module.exports = CustomerService;