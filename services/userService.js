const createError = require("http-errors");
const UserModel = require("../models/user");

const UserModelInstance = new UserModel();

module.exports = class UserService {
  async getAll() {
    try {
      const users = await UserModelInstance.findAll();
      if (!users) throw createError(404, "User table is empty!");

      return users;
    } catch (error) {
      throw error;
    }
  }

  async get(data) {
    const { id } = data;

    try {
      const user = await UserModelInstance.findOneById(id);

      // If user doesn't exist, reject
      if (!user) throw createError(404, "User record not found");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(data) {
    try {
      console.log("post data", data);
      // Check if user already exists
      const user = UserModelInstance.update(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const user = UserModelInstance.create(data);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const user = UserModelInstance.delete(id);

      return user;
    } catch (error) {
      throw error;
    }
  }
};
