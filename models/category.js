const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class CategoryModel {
  /**
   * Creates a new category record
   * @param {Object} data [Category record]
   * @return {Object|null} [Created Category]
   */
  async create(data) {
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
  async update(id, data) {
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
  async find() {
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
  async findCategoryById(id) {
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
};
