const winston = require("winston");
const express = require("express");
const config = require("config");
const morgan = require("morgan");
const app = express();

require("./startup/logging")();
require("./startup/bodyParser")(app);
require("./startup/cors")(app);
app.set("trust proxy", 1);
require("./startup/cookieParser")(app);
app.use(morgan("dev"));
require("./startup/session")(app);
require("./startup/routes")(app);
require("./startup/swagger")(app);
// require("./startup/config")();

const port = process.env.PORT || config.get("port");

const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`),
);

module.exports = server;
