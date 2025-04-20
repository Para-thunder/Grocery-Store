
const config = {
  DB_HOST: process.env.DB_HOST || 'DESKTOP-RPDH2ER',  // Or 'localhost' if on the same machine
  DB_NAME: process.env.DB_NAME || 'Project1',
  DB_PORT: process.env.DB_PORT || 1433,               // Default SQL Server port
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_TRUSTED_CONNECTION: process.env.DB_TRUSTED_CONNECTION || true,
  DB_LOG: process.env.DB_LOG || false
};

// Construct the connection string using the `config` object
const connectionString = `Driver={SQL Server Native Client 11.0};Server=${config.DB_HOST};Database=${config.DB_NAME};Trusted_Connection=${config.DB_TRUSTED_CONNECTION ? 'Yes' : 'No'};`;

module.exports = connectionString;