// test-db-connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  DB_HOST: process.env.DB_HOST || 'localhost\\SQLEXPRESS',
  DB_NAME: process.env.DB_NAME || 'YourDatabaseName',
  DB_PORT: process.env.DB_PORT || 1433,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

async function testConnection() {
  const sequelize = new Sequelize({
    database: config.DB_NAME,
    dialect: 'mssql',
    dialectModulePath: 'msnodesqlv8/lib/sequelize',
    dialectOptions: {
      connectionString: `Server=${config.DB_HOST};Database=${config.DB_NAME};Trusted_Connection=Yes;`,
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    }
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    console.log('Database:', config.DB_NAME);
    console.log('Server:', config.DB_HOST);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('Tried connecting to:');
    console.log('Server:', config.DB_HOST);
    console.log('Database:', config.DB_NAME);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

testConnection();