const sql = require("msnodesqlv8");
const connectionString = require("../config/connectDB");

const getDelivery = async (req, res) => {
    const { orderId } = req.params;
    
    console.log(`Fetching delivery for order ID: ${orderId}`); // Debug log
  
    const query = `
      SELECT 
        dt.tracking_id,
        dt.delivery_status,
        dt.estimated_delivery_date,
        dt.actual_delivery_date,
        dt.courier_service,
        dt.tracking_number,
        o.order_id,
        o.order_date
      FROM Delivery_Tracking dt
      JOIN Orders o ON dt.order_id = o.order_id
      WHERE dt.order_id = ?
    `;
  
    try {
      console.log("Executing query:", query); // Debug log
      
      sql.query(connectionString, query, [orderId], (err, rows) => {
        if (err) {
          console.error("SQL Error:", err);
          return res.status(500).json({ 
            error: "Database error",
            details: err.message 
          });
        }
  
        if (!rows || rows.length === 0) {
          return res.status(404).json({ 
            message: 'No delivery record found for this order ID' 
          });
        }
  
        console.log("Query results:", rows); // Debug log
        res.status(200).json(rows[0]);
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ 
        error: "Internal server error",
        details: err.message 
      });
    }
  };

  module.exports = {
    getDelivery,
  };