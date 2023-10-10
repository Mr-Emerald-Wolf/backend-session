const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const os = require("os");
require("dotenv").config();

const app = express();

// Read MongoDB connection details from environment variables
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

// Using middleware
app.use(express.json());
app.use(morgan("tiny"));

// Setting up routes
app.get("/ping", (req, res) => {
  res.status(200).json({ msg: "ping", hostname: os.hostname() });
});

const userRouter = require("./routes/user");
app.use("/users", userRouter);

// Starting Server
app.listen(8080, () => {
  console.log("Server started at port: 8080");
});
