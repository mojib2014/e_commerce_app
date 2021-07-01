const createError = require("http-errors");
const UserModel = require("../models/user");

const userModelInstance = new UserModel();

module.exports = class UserService {
  async getAll() {
    try {
      const users = await userModelInstance.findAll();
      if (!users)
        throw createError(404, "There are no users currently registered!");

      return users;
    } catch (error) {
      throw error;
    }
  }

  async get(data) {
    const { id } = data;

    try {
      const user = await userModelInstance.findOneById(id);

      // If user doesn't exist, reject
      if (!user)
        throw createError(404, "A User with the given ID was not found!");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(data) {
    try {
      // Check if user already exists
      const user = await userModelInstance.update(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const user = await userModelInstance.create(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const user = await userModelInstance.delete(id);
      if (!user)
        throw createError(404, "A User with the given ID was not found!");
      return user;
    } catch (error) {
      throw error;
    }
  }
};
