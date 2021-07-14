const express = require("express");
const winston = require("winston");
const config = require("config");
const morgan = require("morgan");
const app = express();

app.set("trust proxy", 1);
// require("./startup/logging")();
require("./startup/helmet")(app);
require("./startup/bodyParser")(app);
require("./startup/cors")(app);
require("./startup/cookieParser")(app);
app.use(morgan("combined"));
require("./startup/session")(app);
require("./startup/routes")(app);
require("./startup/swagger")(app);
require("./startup/config")();

const port = process.env.PORT || config.get("port");

const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`),
);

module.exports = server;
