const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const cookieSession = require("cookie-session");
const config = require("config");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const {
  NODE_ENV = "development",

  SESSION_NAME = "sid",
  SESSION_LIFETIME = 1000 * 60 * 60 * 2,
  SESSION_SECRET = config.get("sessionSecret") || "mojib2014",
} = process.env;

const IN_PROD = NODE_ENV === "development";

module.exports = (app, passport) => {
  // Setup static files path
  app.use(express.static("public"));
  app.set("view engine", "ejs");

  // Flash messages
  app.use(flash());

  require("./passport");

  // session setup
  app.use(
    cookieSession({
      name: SESSION_NAME,
      resave: false,
      saveUninitialized: false,
      secret: SESSION_SECRET,
      cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: IN_PROD,
      },
    }),
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Body parsing (to JSON)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cors
  app.use(cors());

  // cookie parser
  app.use(cookieParser(SESSION_SECRET));

  // Morgan
  app.use(morgan("dev"));

  // Helmet
  app.use(helmet());

  // Swagger
  require("./swagger")(app);

  // jwtPrivateKey
  require("./config")();

  // File upload
  //   app.use(fileupload());

  // Routes
  require("./routes")(app);
};
