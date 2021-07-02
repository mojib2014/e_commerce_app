const createError = require("http-errors");
const CartItemModel = require("../models/cartItem");

module.exports = class CartItemService {
  // Create a new cartItem record
  async create(data) {
    try {
      const cartItem = await CartItemModel.create(data);

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  // Update an existing cartItem by a given ID
  async update(id, data) {
    try {
      const cartItem = await CartItemModel.update(id, data);

      if (!cartItem)
        throw createError(404, "A cartItem with the given ID was not found!");

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  // Retrieve all cartItems records
  async getCartItemById(id) {
    try {
      const cartItem = await CartItemModel.find(id);

      if (!cartItem)
        throw createError(404, "A cartItem with the given ID was not found!");

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  // Remove a cartItem by a given ID
  async removeCartItemById(id) {
    try {
      const cartItem = await CartItemModel.delete(id);

      if (!cartItem)
        throw createError(404, "A cartItem with the given ID was not found!");

      return cartItem;
    } catch (err) {
      throw err;
    }
  }
};
