const config = require("config");

module.exports = (req, res, next) => {
  if (!config.get("requiresAuth")) return next();

  if (!req.user.is_admin) return res.status(403).send("Access denied!.");

  next();
};
