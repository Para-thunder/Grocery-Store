const updatePayment = async (req, res) => {
    const { order_id, payment_method, amount, payment_status } = req.body;
  
    try {
      const pool = await sql.connect(); // Ensure sql is properly configured
      await pool.request()
        .input('order_id', sql.Int, order_id)
        .input('payment_method', sql.VarChar(50), payment_method)
        .input('amount', sql.Decimal(10, 2), amount)
        .input('payment_status', sql.VarChar(50), payment_status || 'Pending')
        .query(`
          INSERT INTO Payments (order_id, payment_method, amount, payment_status)
          VALUES (@order_id, @payment_method, @amount, @payment_status)
        `);
  
      res.status(201).json({ message: 'Payment recorded successfully' });
    } catch (err) {
      console.error('Error inserting payment:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getPayment = async (req, res) => {
    const { orderId } = req.params;
  
    const query = `
      SELECT * FROM Payments WHERE order_id = @orderId
    `;
  
    try {
      // Connect to the database using mssql and await connection
      const pool = await sql.connect(connectionString);
  
      // Use parameterized queries with await
      const result = await pool.request()
        .input('orderId', sql.Int, orderId)  // Bind the parameter to the query
        .query(query);
  
      // If no payment is found for the provided orderId
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Payment not found for the given orderId' });
      }
  
      // Respond with the result (payments)
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error('Error fetching payment:', err);  // Log error details
      res.status(500).json({ error: 'Internal server error', details: err.message });  // Return the error message
    }
  };
  
  module.exports = {    
    updatePayment,
    getPayment,
  };