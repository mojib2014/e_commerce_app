const Joi = require("joi");
const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");
const User = require("../models/user");

// Instantiate services
const authService = new AuthService();

module.exports = (app, passport) => {
  app.use("/auth", router);

  // Registration endpoint
  router.post("/register", async (req, res, next) => {
    try {
      const data = req.body;

      const { error } = User.validateUser(data);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await authService.register(data);

      res.send(user);
    } catch (err) {
      next(err);
    }
  });

  // Login endpoint
  router.post(
    "/login",
    passport.authenticate("local", {
      // successRedirect: "/products",
      failureRedirect: "/login",
      session: true,
    }),
    async (req, res, next) => {
      try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const { username, password } = req.body;

        const user = await authService.login({
          email: username,
          password,
        });
        res.send(user);
      } catch (err) {
        next(err);
      }
    },
  );
};

function validateLogin(user) {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}
