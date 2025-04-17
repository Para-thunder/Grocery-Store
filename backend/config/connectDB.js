const sql = require('mssql/msnodesqlv8');

// Use environment variables with fallback values
const serverName = process.env.DB_SERVER || "DESKTOP-RPDH2ER";
const databaseName = process.env.DB_NAME || "Project1";

module.exports = `Driver={SQL Server Native Client 11.0};Server=${serverName};Database=${databaseName};Trusted_Connection=Yes;`;


/* const sql = require('mssql/msnodesqlv8');

const serverName = "HALMS"; //write your servername here
const databaseName = "Project1"; //write your database name here
//const sqlPort = 1433;
module.exports = `Driver={SQL Server Native Client 11.0};Server=${serverName};Database=${databaseName};Trusted_Connection=Yes;`; */