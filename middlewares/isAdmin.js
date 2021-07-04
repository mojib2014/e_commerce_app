module.exports = (req, res, next) => {
  const user = req.user;

  if (!user.is_admin) return res.status(403).send("Access denied!");

  next();
};
