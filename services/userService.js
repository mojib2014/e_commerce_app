const createError = require("http-errors");
const UserModel = require("../models/user");

module.exports = class UserService {
  // Creates a new user record
  async create(data) {
    try {
      const userModelInstance = new UserModel(data);
      const user = await userModelInstance.create();

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Updates an existing user record by a given ID
  async update(data) {
    try {
      // Check if user already exists
      const user = await UserModel.update(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Removes a user record by a given ID
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

  // Retrieves all users records
  async getAll() {
    try {
      const users = await UserModel.findAll();

      if (!users)
        throw createError(404, "There are no users currently registered!");

      return users;
    } catch (error) {
      throw error;
    }
  }

  // Retrieves a user record by a given ID
  async get(id) {
    try {
      const user = await UserModel.findOneById(id);

      // If user doesn't exist, reject
      if (!user)
        throw createError(404, "A User with the given ID was not found!");

      return user;
    } catch (error) {
      throw error;
    }
  }
};
