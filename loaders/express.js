const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const { SESSION_SECRET } = require("../config");

module.exports = (app) => {
  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(logger("dev"));

  app.set("trust proxy", 1);

  app.use(cookieParser(SESSION_SECRET));
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  return app;
};
