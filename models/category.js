const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });
const Joi = require("joi");

module.exports = class CategoryModel {
  /**
   * Creates a new category record
   * @param {Object} data [Category record]
   * @return {Object|null} [Created Category]
   */
  static async create(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "categories") + "RETURNING *";

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      console.table(result);
      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates a category record by a given ID
   * @param {Number} id     [Category ID]
   * @param {Object} data   [Category data]
   * @returns {Object|null} [Updated Category record]
   */
  static async update(id, data) {
    try {
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement =
        pgp.helpers.update(data, null, "categories") + condition;

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Returns all category records
   * @param {null}
   * @return {Array|null} [Category records]
   */
  static async findAll() {
    try {
      const statement = `SELECT * FROM categories`;
      const result = await db.query(statement);
      if (result.rows.length) return result.rows;
      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Returns a category by a given ID
   * @param {Number} id     [Category ID]
   * @return {Object|null}  [Category record]
   */
  static async findCategoryById(id) {
    try {
      const statement = `SELECT * FROM categories WHERE id = $1`;
      const values = [id];

      const result = await db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateCategory(category) {
    const schema = Joi.object({
      category: Joi.string().min(5).max(100).required(),
      description: Joi.string().min(5).max(200),
    });

    return schema.validate(category);
  }
};
