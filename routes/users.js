const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");

const service = new UserService();

module.exports = (app, passport) => {
  app.use("/users", router);
  // Get all users
  // router.get("/", async (req, res, next) => {
  //   try {
  //     const users = await service.getAll();

  //     if (!users) return res.status(404).send("No users found!");

  //     res.status(200).send(users);
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  // Get a user with a specific id
  router.get("/:id", async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).send("Unauthorized!");

      const id = req.params.id;
      const user = await service.get({ id });

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

  //     const response = await service.create({ ...data });
  //     res.status(200).send(response);
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  // Remove a row with a given id
  router.delete("/:id", async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).send("Unauthorized!");

      const { id } = req.params;
      const user = await service.delete(id);

      res.send(user);
    } catch (err) {
      next(err);
    }
  });
};
