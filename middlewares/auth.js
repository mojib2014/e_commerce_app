const config = require("config");

module.exports = (req, res, next) => {
  if (!config.get("requiresAuth")) return next();
  console.log("sessionID: ", req.sessionID);
  if (!req.signedCookies["connect.sid"])
    return res.status(403).send("Access denied. No token provided");

  next();
};
