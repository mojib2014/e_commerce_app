const createError = require("http-errors");
const CategoryModel = require("../models/category");

const categoryModelInstance = new CategoryModel();

module.exports = class CategoryService {
  // Create a new category
  async create(data) {
    try {
      const category = await categoryModelInstance.create(data);

      return category;
    } catch (err) {
      throw err;
    }
  }

  // Update a category by a given ID
  async update(id, data) {
    try {
      const category = await categoryModelInstance.update(id, data);

      if (!category)
        throw createError(404, "A category with the given ID was not found!");

      return category;
    } catch (err) {
      throw err;
    }
  }

  // Find and retrieve all categories
  async getAll() {
    try {
      const categories = await categoryModelInstance.find();

      return categories;
    } catch (err) {
      throw err;
    }
  }

  // Retrieve a category by a given ID
  async getCategoryById(id) {
    try {
      const category = await categoryModelInstance.findCategoryById(id);

      if (!category)
        throw createError(404, "A category with the given ID was not found!");

      return category;
    } catch (err) {
      throw err;
    }
  }
};
