const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class CartItemModel {
  /**
   * Creates a new cartItems record
   * @param {Object} data   [CartItem data]
   * @return {Object|null}  [Created cartItem]
   */
  static async create(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "cartitems") + "RETURNING *";

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updated existing cartItem record
   * @param {Number} id     [CartItem id]
   * @param {Object} data   [CartItem data]
   * @return {Object|null}  [Updated cartItem]
   */
  static async update(id, data) {
    try {
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement = pgp.helpers.update(data, null, "cartItems") + condition;

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieves cartItems for a cart with given cart ID
   * @param {Number} id     [Cart ID]
   * @return {Object|null}  [cartItem]
   */
  static async find(cart_id) {
    try {
      const statement = `SELECT ci.quantity,
                                ci.id AS "cart_item_id",
                                p.*
                                FROM cartItems ci
                                INNER JOIN products p 
                                ON p.id = ci.product_id
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
   * Removes a cart item record from a cartItem with a given cartItem ID
   * @param {Object} id     [CartItem ID]
   * @return {Object|null}  [Removed cartItem]
   */
  static async delete(id) {
    try {
      const statement = `DELETE FROM cartItems WHERE id = $1 RETURNING *`;
      const values = [id];

      const result = await db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
