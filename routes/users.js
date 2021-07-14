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

    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
});

// Get a user by ID
router.get("/:id", [auth], async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOneById(id);

    if (!user)
      return res.status(404).send("No user with the given ID was found!");

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

// // Create a new user
// router.post("/", async (req, res, next) => {
//   try {
//     const data = req.body;

//     const response = await userService.create({ ...data });
//     res.status(200).send(response);
//   } catch (err) {
//     next(err);
//   }
// });

// Update an existing user by a given ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const { error } = User.validateUser(data);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.update(id, data);
    if (!user)
      return res.status(404).send("A user with the given ID was not found!");

    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Remove a row with a given id
router.delete("/:id", [isAdmin, auth], async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.delete(id);

    if (!user)
      return res.status(404).send("A user with the given ID was not found!");

    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
