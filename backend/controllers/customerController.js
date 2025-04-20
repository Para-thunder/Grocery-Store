const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");
const Customers = require("../models/Customer");


const createCustomer = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  // Validate required fields
  if (!name || !email || !password || !address) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    // Hash the password (using bcrypt)
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to insert a new customer
    const customerQuery = `
      INSERT INTO Customers (name, email, password_hash, address, role, created_at)
      OUTPUT INSERTED.customer_id
      VALUES (?, ?, ?, ?, ?, GETDATE())
    `;

    // Debugging: Log the query and parameters
    console.log("Executing Query:", customerQuery);
    console.log("Query Parameters:", {
      name,
      email: email.toLowerCase(),
      hashedPassword,
      address,
      role: role || "customer",
    });

    // Execute the query
    const customerResult = await new Promise((resolve, reject) => {
      sql.query(
        connectionString,
        customerQuery,
        [
          name,
          email.toLowerCase(), // Normalize email
          hashedPassword,      // Use hashed password
          address,
          role || "customer",  // Default role is 'customer'
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // Get the inserted customer ID
    const customerId = customerResult[0].customer_id;

    return res.status(201).json({
      success: true,
      customerId: customerId,
      message: "Customer created successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({
      error: "Failed to create customer",
      details: err.message,
    });
  }
};

module.exports = {
  createCustomer,
};