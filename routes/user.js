const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/create", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();

    res.status(200).json({ user: newUser });
  } catch (error) {}
});
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(400).json({
        err: "Users not found",
      });
    }
    res.status(200).json({ users: users });
  } catch (error) {}
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      res.status(400).json({
        err: "User not found",
      });
    }
    res.status(200).json({ user: findUser });
  } catch (error) {}
});

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({
      err: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(400).json({
        err: "User not found",
      });
    }
    res.status(200).json({
      message: "User has been deleted",
    });
  } catch (error) {}
});
module.exports = router;
