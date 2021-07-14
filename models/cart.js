const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });
const Joi = require("joi");
const db = require("../db");
const CartItemModel = require("../models/cartItem");

module.exports = class CartModel {
  constructor(data = {}) {
    this.created = data.created || moment.utc().toISOString();
    this.modified = moment.utc().toISOString();
    // this.converted = data.converted || null;
    this.user_id = data.user_id;
    this.is_active = data.is_active || true;
  }

  /**
   * Creates a new cart for a user
   * @param {Number} user_id [User ID]
   * @return {Object|null} [Created cart record for a given user]
   */
  async create() {
    try {
      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert({ ...this }, null, "carts") + "RETURNING *";

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Updates an existing cart record by a given ID
  static async updateCart(id, data) {
    try {
      // Add current date and time to modified property
      data.modified = moment.utc().toISOString();

      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement = pgp.helpers.update(data, null, "carts") + condition;

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Addes a cartItem record for a users cart
  static async addCartItem(user_id, item) {
    try {
      // Load user cart with a given ID
      const cart = await this.findOneByUserId(user_id);

      if (!cart) throw createError(404, "No cart with the given ID was found!");
      // Create cart item
      const cartItem = await CartItemModel.create({
        cart_id: cart.id,
        ...item,
      });

      return cartItem;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Updates an existing record by a given ID
  static async updateItem(cartItemId, data) {
    try {
      const cartItem = await CartItemModel.update(cartItemId, data);

      return cartItem;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   *
   * @param {Number} cartItemId [CartItem ID]
   * @returns {Object|null}     [Deleted CartItem]
   */
  static async removeItem(cartItemId) {
    try {
      // Remove cart item by ID
      const cartItem = await CartItemModel.delete(cartItemId);

      if (!cartItem)
        throw createError(404, "No cartItem was found with the given ID!");

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Loads a cart with a given user ID
   * @param {Number} user_id [User ID]
   * @return {Object|null} [Cart record]
   */
  static async findOneByUserId(user_id) {
    try {
      const statement = `SELECT * FROM carts WHERE user_id = $1`;
      const values = [user_id];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Loads a cart by given cart ID
   * @param {Number} id [Cart ID]
   * @return {Object|null} [Cart record]
   */
  static async findOneById(id) {
    try {
      const statement = `SELECT * FROM carts WHERE id = $1`;
      const values = [id];

      const result = db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateCart(cart) {
    const schema = Joi.object({
      created: Joi.date(),
      modified: Joi.date(),
      user_id: Joi.string().min(1).required(),
      is_active: Joi.boolean(),
    });

    return schema.validate(cart);
  }
};
