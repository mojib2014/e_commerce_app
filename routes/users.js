const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");

const service = new UserService();

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await service.getAll();

    if (!users) return res.status(404).send("No users found!");

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

// Get a user with a specific id
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await service.get({ id });
    if (!user)
      return res.status(404).send("No user with the given ID was found!");

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;

    const response = await service.create({ ...data });
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

// Remove a row with a given id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await service.delete(id);

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
