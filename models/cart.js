const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });
const db = require("../db");

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
};
