const config = require("config");
const session = require("express-session");

module.exports = (app) => {
  app.use(
    session({
      secret: config.get("session_secret"),
      resave: true,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );
};
