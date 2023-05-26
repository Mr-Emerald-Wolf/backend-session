const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
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
