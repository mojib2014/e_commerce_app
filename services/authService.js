const createError = require("http-errors");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

module.exports = class AuthService {
  async register(data) {
    try {
      const salt = 10;
      const hashed = await bcrypt.hash(data.password, salt);
      data.password = hashed;

      const { email } = data;

      const user = await UserModel.findOneByEmail(email);

      if (user) throw createError(409, "Email already in use!");

      const userModelInstance = new UserModel(data);

      return await userModelInstance.create();
    } catch (err) {
      throw createError(500, err);
    }
  }

  async login(data) {
    try {
      const { email, password } = data;

      const user = await UserModel.findOneByEmail(email);

      if (!user) throw createError(401, "Incorrect username!");

      const matches = await bcrypt.compare(password, user.password);

      if (!matches) throw createError(401, "Incorrect password!");

      return user;
    } catch (err) {
      throw createError(500, err);
    }
  }
};
