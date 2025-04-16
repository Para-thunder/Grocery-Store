exports.placeOrder = (req, res) => {
    const { items, total } = req.body;
    const userId = req.user?.user_id || 1; // Replace with actual auth user ID
  
    const sqlInsertOrder = `
      INSERT INTO Orders (user_id, total_amount, order_date, status)
      OUTPUT INSERTED.order_id
      VALUES (?, ?, GETDATE(), 'pending')
    `;
  
    sql.open(connectionString, (err, conn) => {
      if (err) return res.status(500).json({ message: "DB error", err });
  
      conn.query(sqlInsertOrder, [userId, total], (err, result) => {
        if (err) return res.status(500).json({ message: "Order failed", err });
  
        const orderId = result[0].order_id;
  
        const values = items.map(
          item => `(${orderId}, ${item.product_id}, ${item.quantity})`
        ).join(',');
  
        const sqlInsertDetails = `
          INSERT INTO OrderDetails (order_id, product_id, quantity)
          VALUES ${values}
        `;
  
        conn.query(sqlInsertDetails, (err) => {
          if (err) return res.status(500).json({ message: "Order details failed", err });
  
          res.json({ message: "Order placed", orderId });
        });
      });
    });
  };
  