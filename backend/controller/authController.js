const sql = require("msnodesqlv8");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectionString = require("../config/connectDB");

// User registration
const register = async (req, res) => {
  const { email, password, name, address } = req.body; // Removed phone since not in your schema

  // Validate input
  if (!email || !password || !name || !address) {
    return res.status(400).json({ error: 'Email, password, name, and address are required' });
  }

  try {
    // Check if user already exists
    const checkUserQuery = "SELECT email FROM Customers WHERE email = ?";
    const existingUser = await new Promise((resolve, reject) => {
      sql.query(connectionString, checkUserQuery, [email], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const insertUserQuery = `
      INSERT INTO Customers (email, password_hash, name, address, role)
      VALUES (?, ?, ?, ?, 'customer')
    `;
    
    await new Promise((resolve, reject) => {
      sql.query(connectionString, insertUserQuery, 
        [email, hashedPassword, name, address], 
        (err) => {
          if (err) reject(err);
          resolve();
        });
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const getUserQuery = "SELECT * FROM Customers WHERE email = ?";
    const users = await new Promise((resolve, reject) => {
      sql.query(connectionString, getUserQuery, [email], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.customer_id,  // Changed from user_id to customer_id
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Return user data (without password) and token
    const userData = {
      id: user.customer_id,  // Changed from user_id to customer_id
      email: user.email,
      name: user.name,
      address: user.address,
      role: user.role
    };

    res.json({ 
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

module.exports = { register, login };