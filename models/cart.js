const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });
const Joi = require("joi");
const db = require("../db");
const CartItem = require("../models/cartItem");

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
   * @param {Number} user_id [User user_id]
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

  // Updates an existing cart record by a given cart_id
  static async updateCart(cart_id, data) {
    try {
      // Add current date and time to modified property
      data.modified = moment.utc().toISOString();

      const condition = pgp.as.format(
        "WHERE cart_id = ${cart_id} RETURNING *",
        {
          cart_id,
        },
      );
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
      // Load user cart with a given user_id
      const cart = await this.findOneByUserId(user_id);

      if (!cart) throw createError(404, "No cart with the given ID was found!");
      // Create cart item
      const cartItemInstance = new CartItem({ cart_id: cart.cart_id, ...item });

      const cartItem = await cartItemInstance.create();

      return cartItem;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Updates an existing cart record by a given cart_id
  static async updateItem(cart_id, data) {
    try {
      const cartItem = await CartItem.update(cart_id, data);

      return cartItem;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Removes a cart_item by a cart_item_id
   * @param {Number} cart_item_id [CartItem cart_item_id]
   * @returns {Object|null}     [Deleted CartItem]
   */
  static async removeCartItemItem(cart_item_id) {
    try {
      // Remove cart item by cart_item_id
      const cartItem = await CartItem.delete(cart_item_id);

      if (!cartItem)
        throw createError(404, "No cartItem was found with the given ID!");

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Loads a cart with a given user_id
   * @param {Number} user_id [User user_id]
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
   * Loads a cart by given cart_id
   * @param {Number} cart_id [Cart cart_id]
   * @return {Object|null} [Cart record]
   */
  static async findOneById(cart_id) {
    try {
      const statement = `SELECT * FROM carts WHERE cart_id = $1`;
      const values = [cart_id];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async checkout(cart_id, user_id, checkoutInfo) {
    try {
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateCart(cart) {
    const schema = Joi.object({
      created: Joi.date(),
      modified: Joi.date(),
      user_id: Joi.number().min(1).required(),
      is_active: Joi.boolean(),
    });

    return schema.validate(cart);
  }
};
