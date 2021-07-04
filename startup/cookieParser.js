const cookieParser = require("cookie-parser");
const config = require("config");

module.exports = (app) => {
  app.use(cookieParser(config.get("sessionSecret")));
};
