const createError = require("http-errors");
const ProductModel = require("../models/product");

const productModelInstance = new ProductModel();

module.exports = class ProductService {
  async list(options) {
    try {
      // Load products
      const products = await productModelInstance.find(options);

      if (!products) return createError(404, "Products table is empty!");

      return products;
    } catch (err) {
      throw err;
    }
  }

  async getProductByUserId(id) {
    try {
      // Check if this user have any products listed
      const products = await productModelInstance.findUsersProducts(id);

      if (!products)
        throw createError(404, "User with the given ID has no products listed");

      return products;
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const product = await productModelInstance.create(data);

      return product;
    } catch (err) {
      throw err;
    }
  }
};
