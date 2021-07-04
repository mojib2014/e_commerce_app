const moment = require("moment");
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class Address {
  constructor(data = {}) {
    this.created = data.created || moment.utc().toISOString();
    this.modified = data.modified || moment.utc().toISOString();
    this.street = data.street;
    this.city = data.city;
    this.zip = data.zip || null;
    this.unit_number = data.unit_number;
    this.country = data.country;
    this.user_id = data.user_id;
  }

  /**
   * Creates a new address record for given user
   * @param {Object}  data    [Address data to insert]
   * @returns {Object|null}   [Created address record]
   */
  async create() {
    try {
      const statement =
        pgp.helpers.insert({ ...this }, null, "address") + "RETURNING *";

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   *
   * @param {Number} id     [User ID]
   * @param {Object} data   [Address data]
   * @returns {Object|null} [Updated address record]
   */
  async update(id, data) {
    try {
      data.modified = moment.utc().toISOString();
      const condition = pgp.as.format("WHERE user_id = ${id} RETURNING *", {
        id,
      });
      const statement = pgp.helpers.update(data, null, "address") + condition;

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieve an existing address record by user ID
   * @param {Number}  id    [User ID]
   * @returns {Object|null} [Addres record]
   */
  async getAddressByUserId(id) {
    try {
      const statement = `SELECT * FROM address WHERE user_id = $1`;
      const values = [id];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
