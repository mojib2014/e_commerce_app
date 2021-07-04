const express = require("express");
const router = express.Router();
const logger = require("../startup/logging");
const AuthService = require("../services/authService");

// Instantiate services
const authService = new AuthService();

module.exports = (app, passport) => {
  app.use("/auth", router);

  // Registration endpoint
  router.post("/register", async (req, res, next) => {
    try {
      const data = req.body;

      const user = await authService.register(data);

      res.send(user);
    } catch (err) {
      logger.info(err);
      next(err);
    }
  });

  // Login endpoint
  router.post(
    "/login",
    passport.authenticate("local", {
      // successRedirect: "/",
      failureRedirect: "/login",
      session: true,
    }),
    async (req, res, next) => {
      try {
        const { username, password } = req.body;

        const user = await authService.login({
          email: username,
          password,
        });
        res.send(user);
      } catch (err) {
        logger.info(err);
        next(err);
      }
    },
  );
};
