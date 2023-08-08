const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();


// Read MongoDB connection details from environment variables
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

// Construct the MongoDB URI
const mongoURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

// C


mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());

app.get("/ping", (req, res) => {
  console.log(req);
  res.send("pong");
});
const userRouter = require("./routes/user");
app.use("/users", userRouter);

app.listen(8080, () => {
  console.log("Server started at port: 8080");
});
