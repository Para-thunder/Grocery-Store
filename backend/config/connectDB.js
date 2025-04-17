module.exports = {
  DB_HOST: process.env.DB_HOST || 'DESKTOP-RPDH2ER',  // Or 'localhost' if on same machine
  DB_NAME: process.env.DB_NAME || 'Project1',
  DB_PORT: process.env.DB_PORT || 1433,               // Default SQL Server port
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Windows Authentication specific
  DB_TRUSTED_CONNECTION: process.env.DB_TRUSTED_CONNECTION || true,
  
  // Optional for debugging
  DB_LOG: process.env.DB_LOG || false
};