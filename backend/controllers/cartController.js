const sql = require('mssql');

exports.addToCart = (req, res) => {
    const { product_id, quantity } = req.body;
    const userId = req.user?.user_id || 1; // Replace with actual auth
    
    // Check if item already exists in cart
    const checkSql = `SELECT * FROM Cart WHERE user_id = ? AND product_id = ?`;
    
    // Add or update item in cart
    const upsertSql = `
        IF EXISTS (SELECT 1 FROM Cart WHERE user_id = ? AND product_id = ?)
            UPDATE Cart SET quantity = quantity + ? 
            WHERE user_id = ? AND product_id = ?
        ELSE
            INSERT INTO Cart (user_id, product_id, quantity)
            VALUES (?, ?, ?)
    `;
    
    sql.connect(connectionString, (err, conn) => {
        if (err) return res.status(500).json({ message: "DB error", err });
        
        conn.query(checkSql, [userId, product_id], (err, result) => {
            if (err) return res.status(500).json({ message: "Cart operation failed", err });
            
            conn.query(upsertSql, 
                [userId, product_id, quantity, userId, product_id, userId, product_id, quantity], 
                (err, result) => {
                    if (err) return res.status(500).json({ message: "Cart operation failed", err });
                    res.json({ message: "Item added to cart" });
                }
            );
        });
    });
};

exports.getCart = (req, res) => {
    const userId = req.user?.user_id || 1;
    
    const sql = `
        SELECT c.product_id, p.name, p.price, c.quantity, (p.price * c.quantity) as subtotal
        FROM Cart c
        JOIN Products p ON c.product_id = p.product_id
        WHERE c.user_id = ?
    `;
    
    sql.connect(connectionString, (err, conn) => {
        if (err) return res.status(500).json({ message: "DB error", err });
        
        conn.query(sql, [userId], (err, result) => {
            if (err) return res.status(500).json({ message: "Failed to get cart", err });
            
            const total = result.recordset.reduce((sum, item) => sum + item.subtotal, 0);
            res.json({ items: result.recordset, total });
        });
    });
};

exports.removeFromCart = (req, res) => {
    const { product_id } = req.body;
    const userId = req.user?.user_id || 1;
    
    const sql = `DELETE FROM Cart WHERE user_id = ? AND product_id = ?`;
    
    sql.connect(connectionString, (err, conn) => {
        if (err) return res.status(500).json({ message: "DB error", err });
        
        conn.query(sql, [userId, product_id], (err, result) => {
            if (err) return res.status(500).json({ message: "Failed to remove item", err });
            res.json({ message: "Item removed from cart" });
        });
    });
};