const sql = require('mssql/msnodesqlv8');

const serverName = "DESKTOP-RPDH2ER"; //write your servername here
const databaseName = "Project1"; //write your database name here
//const sqlPort = 1433;

module.exports = `Driver={SQL Server Native Client 11.0};Server=${serverName};Database=${databaseName};Trusted_Connection=Yes;`;