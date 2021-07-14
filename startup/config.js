const config = require("config");

module.exports = () => {
  if (!config.get("sessionSecret"))
    throw new Error("FATAL ERROR: session secret is not defined.");
};
