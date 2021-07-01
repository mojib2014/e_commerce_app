const createError = require("http-errors");
const UserModel = require("../models/user");

const userModelInstance = new UserModel();

module.exports = class AuthService {
  async register(data) {
    try {
      const { email } = data;

      const user = await userModelInstance.findOneByEmail(email);

      if (user) throw createError(409, "Email already in use!");

      return await userModelInstance.create(data);
    } catch (err) {
      throw createError(500, err);
    }
  }

  async login(data) {
    try {
      const { email, password } = data;

      const user = await userModelInstance.findOneByEmail(email);

      if (!user) throw createError(401, "Incorrect username or password!");

      if (user.password !== password)
        throw createError(401, "Incorrect username or password!");

      return user;
    } catch (err) {
      throw createError(500, err);
    }
  }
};
