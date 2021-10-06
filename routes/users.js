const express = require("express");
const router = express.Router();
const User = require("../models/user");
const isAdmin = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");

// Get all users
router.get("/", [isAdmin, auth], async (req, res, next) => {
  try {
    const users = await User.getAll();

    if (!users) return res.status(404).send("No users found!");

    res.send(users);
  } catch (err) {
    next(err);
  }
});

// Retrieve a user by ID
router.get("/:user_id", [auth], async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOneById(user_id);

    if (!user)
      return res.status(404).send("No user with the given ID was found!");

    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Update an existing user by a given ID
router.put("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const data = req.body;

    const { error } = User.validateUser(data);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.update(user_id, data);
    if (!user)
      return res.status(404).send("A user with the given ID was not found!");

    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Remove a user with a given user_id
router.delete("/:user_id", [isAdmin, auth], async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await userService.delete(user_id);

    if (!user)
      return res.status(404).send("A user with the given ID was not found!");

    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
