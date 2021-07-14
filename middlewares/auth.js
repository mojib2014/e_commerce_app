const config = require("config");

module.exports = (req, res, next) => {
  if (!config.get("requiresAuth")) return next();

  if (!req.headers.cookie || !req.user)
    return res.status(403).send("Access denied. No token provided");

  next();
};
