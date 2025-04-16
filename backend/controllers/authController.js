// controllers/authController.js
const sql = require("msnodesqlv8");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectionString = require("../config/connectDB");

// User registration
const register = async (req, res) => {
  const { email, password, name, address } = req.body;

  if (!email || !password || !name || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const checkQuery = "SELECT email FROM Customers WHERE email = ?";
    const existingUser = await new Promise((resolve, reject) => {
      sql.query(connectionString, checkQuery, [email], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
      INSERT INTO Customers (email, password_hash, name, address, role)
      VALUES (?, ?, ?, ?, 'customer')
    `;
    
    await new Promise((resolve, reject) => {
      sql.query(connectionString, insertQuery, 
        [email, hashedPassword, name, address], 
        (err) => {
          if (err) reject(err);
          resolve();
        });
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const query = "SELECT * FROM Customers WHERE email = ?";
    const users = await new Promise((resolve, reject) => {
      sql.query(connectionString, query, [email], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.customer_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: user.customer_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };