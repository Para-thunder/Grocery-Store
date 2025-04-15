const express = require("express");
const sql = require("msnodesqlv8");
const connectionString = require("./config/connectDB.js");
const groceryRouter = require("./routes/groceryRoutes.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const serverPort = 4000;

const testConnection = () => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Database connection failed:", err);
    } else {
      console.log("Connected to database successfully!");
      console.log(`Server is running at: http://localhost:${serverPort}`);
    }
  });
};

app.use("/api", groceryRouter);

app.get("/", (req, res) => {
  return res.send("Grocery Store API is running");
});

// Add the error handler right here, before app.listen
app.use((req, res) => {
  console.log(`Route not found: ${req.method}${req.url}`);
  res.status(404).send(`Route not found: ${req.method}${req.url}`);
});

app.listen(serverPort, () => {
  testConnection();
});