const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/connectDB');
console.log("Database Configuration:");
console.log("DB_HOST:", config.DB_HOST);
console.log("DB_NAME:", config.DB_NAME);
console.log("DB_PORT:", config.DB_PORT);
console.log("Trusted_Connection:", config.DB_TRUSTED_CONNECTION);
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize({
  database: config.DB_NAME, // 'Project1'
  dialect: 'mssql',
  dialectModulePath: 'msnodesqlv8/lib/sequelize',
  dialectOptions: {
    
    options: {
      trustedConnection:true,
      encrypt: false,        // Disable first for testing
      trustServerCertificate: true,
      useUTC: false         // Match your local timezone
    },
  },
  logging:console.log 
});
// Model loading and associations remain the same
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== basename)
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to ${config.DB_NAME} on ${config.DB_HOST}`);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
})();


module.exports = db;