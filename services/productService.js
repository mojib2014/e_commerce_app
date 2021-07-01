const createError = require("http-errors");
const ProductModel = require("../models/product");

const productModelInstance = new ProductModel();

module.exports = class ProductService {
  async list(options) {
    try {
      // Load products
      const products = await productModelInstance.findAll();

      if (!products)
        return createError(404, "There are currently no products!");

      return products;
    } catch (err) {
      throw err;
    }
  }

  async getProductsByUserId(id) {
    try {
      // Check if this user have any products listed
      const products = await productModelInstance.findUserProducts(id);

      if (!products)
        throw createError(404, "User with the given ID has no products listed");

      return products;
    } catch (err) {
      throw err;
    }
  }

  async getProductById(id) {
    try {
      const product = await productModelInstance.findOneById(id);
      if (!product)
        throw createError(404, "Product with the given ID was not found!");

      return product;
    } catch (err) {
      throw err;
    }
  }

  async getProductByCategoryId(id) {
    try {
      const product = await productModelInstance.findProductByCategoryId(id);

      if (!product)
        throw createError(404, "A product with the given ID was not found!");

      return product;
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

  async update(id, data) {
    try {
      const product = await productModelInstance.update(id, data);

      if (!product)
        throw createError(404, "A product with the given ID was not found!");

      return product;
    } catch (err) {
      throw err;
    }
  }

  async remove(id) {
    try {
      const product = await productModelInstance.delete(id);

      if (!product)
        throw createError(404, "A product with the given ID was not found!");

      return product;
    } catch (err) {
      throw err;
    }
  }
};
