const express = require("express");
const passport = require("passport");
const logger = require("./startup/logging");
const config = require("config");

const app = express();
const port = config.get("port") || 5000;

// Passport setup
app.set("trust proxy", 1);
require("./startup/express")(app, passport);

app.listen(port, () => logger.debug(`Listening on port ${port}...`));

module.exports = app;
