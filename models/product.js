const Joi = require("joi");
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class ProductModel {
  /**
   * List products
   * @param {Object} options [Query options]
   * @return {Array|[]} [Array of products]
   */

  async findAll(options = {}) {
    try {
      // Generate SQL statement
      const statement = `SELECT * FROM products`;
      const values = [];

      const result = await db.query(statement);

      if (result.rows.length) return result.rows;

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
   *
   * @param {Number} category_id [categoryId]
   * @returns {Object|null} [product record]
   */
  async findProductByCategoryId(id) {
    try {
      const statement = `SELECT * FROM products WHERE category_id = $1`;
      const values = [id];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows;

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Return a product by userID
   * @param {String} id [User ID]
   * @return {Object|null} [Product record]
   */
  async findUserProducts(user_id) {
    try {
      const statement = `SELECT * FROM products
                           WHERE user_id = $1`;
      const values = [user_id];

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

  /**
   *
   * @param {Number} id [Product ID]
   * @returns {Object|null} [Product record]
   */
  async update(id, data) {
    try {
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement = pgp.helpers.update(data, null, "products") + condition;

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Remove a product by a given ID
   * @param {Number} id [Product ID]
   * @return {Object|null} [Deleted product]
   */
  async delete(id) {
    try {
      const statement = `DELETE FROM products WHERE id = $1 RETURNING *`;
      const values = [id];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateProduct(prodcut) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(100).required(),
      description: Joi.string().min(20).max(200),
      condition: Joi.string().max(50).required(),
      quantity: Joi.number().min(0).required(),
      price: Joi.number().positive().required(),
      category_id: Joi.number().positive().required(),
      user_id: Joi.number().positive().required(),
    });
    return schema.validate(product);
  }
};
