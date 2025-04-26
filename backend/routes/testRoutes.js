// routes/testRoutes.js
const express = require('express');
const { sequelize } = require('../models');
const router = express.Router();

router.get('/db-info', async (req, res) => {
  try {
    const [dbInfo] = await sequelize.query(`
      SELECT 
        @@SERVERNAME AS server_name,
        DB_NAME() AS current_database,
        SYSTEM_USER AS login_name,
        (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo') AS tables_count
    `);

    const [products] = await sequelize.query('SELECT COUNT(*) AS count FROM Products');

    res.json({
      status: 'success',
      connection: {
        server: dbInfo[0].server_name,
        database: dbInfo[0].current_database,
        login: dbInfo[0].login_name,
        tables: dbInfo[0].tables_count,
        products: products[0].count
      },
      config: {
        host: sequelize.config.host,
        database: sequelize.config.database,
        dialect: sequelize.config.dialect
      }
    });
  } catch (err) {
    console.error('Database info failed:', err);
    res.status(500).json({
      status: 'error',
      error: err.message,
      config: sequelize.config
    });
  }
});

module.exports = router;