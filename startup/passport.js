const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const AuthService = require("../services/authService");
const AuthServiceInstance = new AuthService();

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Configure local strategy to be use for local login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await AuthServiceInstance.login({
          email: username,
          password,
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  return passport;
};
