const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class ProductModel {
  /**
   * List products
   * @param {Object} options [Query options]
   * @return {Array|[]} [Array of products]
   */

  async find(options = {}) {
    try {
      // Generate SQL statement
      const statement = `SELECT * 
                                FROM products`;
      const values = [];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Return a product with the given ID
   * @param {String} [User ID]
   * @return {Object|null} [User record]
   */
  async findOneById(id) {
    try {
      const statement = `SELECT * FROM products WHERE id = $1`;
      const values = [id];

      const result = await db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Return a product by userID
   * @param {String} id [User ID]
   * @return {Object|null} [Product record]
   */
  async findUsersProducts(userId) {
    try {
      const statement = `SELECT * FROM products
                           WHERE user_id = $1`;
      const values = [userId];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows;

      return null;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Creates a new product record by a specific user
   * @param {Object} data [Product data]
   * @return {Object|null} [Created product record]
   */
  async create(data) {
    try {
      // Generate SQL statement - using helper for dynamic parameter inject
      const statement =
        pgp.helpers.insert(data, null, "products") + "RETURNING *";
      // Execute SQL statement
      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
