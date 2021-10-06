const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });
const Joi = require("joi");

module.exports = class CategoryModel {
  constructor(data = {}) {
    this.category = data.category;
    this.description = data.description;
  }
  /**
   * Creates a new category record
   * @return {Object|null} [Created Category]
   */
  async create() {
    try {
      const statement =
        pgp.helpers.insert({ ...this }, null, "categories") + "RETURNING *";

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates a category record by a given category_id
   * @param {Number} category_id     [Category category_id]
   * @param {Object} data   [Category data]
   * @returns {Object|null} [Updated Category record]
   */
  static async update(category_id, data) {
    try {
      const condition = pgp.as.format(
        "WHERE category_id = ${category_id} RETURNING *",
        {
          category_id,
        },
      );
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
   * Returns a category by a given category_id
   * @param {Number} category_id     [Category category_id]
   * @return {Object|null}  [Category record]
   */
  static async findCategoryById(category_id) {
    try {
      const statement = `SELECT * FROM categories WHERE category_id = $1`;
      const values = [category_id];

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
