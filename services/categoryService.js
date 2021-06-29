const createError = require("http-errors");
const CategoryModel = require("../models/category");

const categoryModelInstance = new CategoryModel();

module.exports = class CategoryService {
  async getAll() {
    try {
      const categories = await categoryModelInstance.find();

      return categories;
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const category = await categoryModelInstance.create(data);

      return category;
    } catch (err) {
      throw err;
    }
  }
};
