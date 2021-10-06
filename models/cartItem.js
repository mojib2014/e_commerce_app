const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });
const Joi = require("joi");

module.exports = class CartItemModel {
  constructor(data = {}) {
    this.quantity = data.quantity;
    this.cart_id = data.cart_id;
    this.product_id = data.product_id;
  }
  /**
   * Creates a new cartItems record for a given cart
   * @return {Object|null}  [Created cartItem]
   */
  async create() {
    try {
      const statement =
        pgp.helpers.insert({ ...this }, null, "cart_items") + "RETURNING *";

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updated existing cart_item record
   * @param {Number} cart_item_id     [Cart_item cart_item_id]
   * @param {Object} data   [Cart_item data]
   * @return {Object|null}  [Updated cart_item]
   */
  static async update(cart_item_id, data) {
    try {
      const condition = pgp.as.format(
        "WHERE cart_item_id = ${cart_item_id} RETURNING *",
        { cart_item_id },
      );
      const statement =
        pgp.helpers.update(data, null, "cart_items") + condition;

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieves cartItems for a cart with given cart_id
   * @param {Number} cart_id     [Cart cart_id]
   * @return {Object|null}  [cartItem]
   */
  static async find(cart_id) {
    try {
      const statement = `SELECT ci.quantity,
                                ci.cart_item_id,
                                p.product_id,
                                p.name,
                                p.description,
                                p.condition,
                                p.price,
                                categories.category,
                                p.user_id
                                FROM cart_items ci
                                INNER JOIN products p 
                                ON p.product_id = ci.product_id
                                INNER JOIN categories
                                ON p.category_id = categories.category_id
                                WHERE cart_id = $1`;
      const values = [cart_id];

      const result = await db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Removes a cart item record from a cartItem with a given cart_item_id
   * @param {Object} id     [CartItem cart_item_id]
   * @return {Object|null}  [Removed cartItem]
   */
  static async delete(cart_item_id) {
    try {
      const statement = `DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *`;
      const values = [cart_item_id];

      const result = await db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateCartItem(cartItem) {
    const schema = Joi.object({
      quantity: Joi.number().min(0).required(),
      cart_id: Joi.number().min(1).required(),
      product_id: Joi.number().min(1).required(),
    });

    return schema.validate(cartItem);
  }
};
