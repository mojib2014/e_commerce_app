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
};
