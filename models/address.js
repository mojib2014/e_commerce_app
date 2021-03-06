const moment = require("moment");
const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });
const Joi = require("joi");

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
        pgp.helpers.insert({ ...this }, null, "addresses") + "RETURNING *";

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   *
   * @param {Number} user_id     [User user_id]
   * @param {Object} data   [Address data]
   * @returns {Object|null} [Updated address record]
   */
  static async update(user_id, data) {
    try {
      data.modified = moment.utc().toISOString();

      const condition = pgp.as.format(
        "WHERE user_id = ${user_id} RETURNING *",
        {
          user_id,
        },
      );
      const statement = pgp.helpers.update(data, null, "addresses") + condition;

      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieve an existing address record by user ID
   * @param {Number}  user_id    [User user_id]
   * @returns {Object|null} [Addres record]
   */
  static async getAddressByUserId(user_id) {
    try {
      const statement = `SELECT * FROM addresses WHERE user_id = $1`;
      const values = [user_id];

      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateAddress(address) {
    const schema = Joi.object({
      street: Joi.string().max(50).required(),
      city: Joi.string().max(50).required(),
      zip: Joi.number().min(5).required(),
      unit_number: Joi.number(),
      country: Joi.string().max(50).required(),
      created: Joi.date(),
      modified: Joi.date(),
      user_id: Joi.number().min(1).required(),
    });

    return schema.validate(address);
  }
};
