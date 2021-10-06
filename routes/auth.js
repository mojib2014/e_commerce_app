"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");
const AuthService = require("../services/authService");
const User = require("../models/user");
const logger = require("../startup/logging");

// Instantiate services
const authService = new AuthService();

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

router.get("/login", (req, res) => {
  res.render("login");
});

// Login endpoint
router.post("/login", function (req, res, next) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("error", err.message);
      return res.status(500).send(err);
    }
    if (!user && info) {
      req.flash("error", info.message);
      return res.status(422).send(info);
    }
    req.user = user;
    req.login(req.user, function (err) {
      if (err) {
        req.flash("error", err.message);
        console.log("/login error: ", err);
        return next(err);
      }
      req.flash("message", info.message);
      return res.send(info);
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session = null;

  res.send("logedout successfuly");
});

module.exports = router;
