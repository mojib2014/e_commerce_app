const bcrypt = require("bcrypt");

module.exports = (password) => {
  const salt = 10;

  const hashed = bcrypt.hash(password, salt);

  return hashed;
};
