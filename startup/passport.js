const Joi = require("joi");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");
const logger = require("./logging");

// Set method to serialize data to store in cookie
passport.serializeUser(function (user, done) {
  done(null, user.user_id);
});

// Set method to deserialize data stored in cookie and attach to req.user
passport.deserializeUser(async function (user_id, done) {
  try {
    const user = await User.findOneById(user_id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

// Configure local strategy to be use for local login
passport.use(
  new LocalStrategy(async function (username, password, done) {
    const { error } = validateUser({ username, password });
    if (error) return done(error, false, { message: error.details[0].message });

    try {
      const user = await User.findOneByEmail(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const matches = await bcrypt.compare(password, user.password);

      if (!matches)
        return done(null, false, { message: "Incorrect password." });

      return done(null, user, { message: "Successfully loged in." });
    } catch (err) {
      console.log("pssport errror", err);
      return done(err);
    }
  }),
);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}
