const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");
const isAdmin = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");

const userService = new UserService();

// Get all users
router.get("/", [isAdmin, auth], async (req, res, next) => {
  try {
    const users = await userService.getAll();

    if (!users) return res.status(404).send("No users found!");

    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
});

// Get a user by ID
router.get("/:id", [isAdmin, auth], async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.get(id);

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

// Remove a row with a given id
router.delete("/:id", [isAdmin, auth], async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.delete(id);

    res.send(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
