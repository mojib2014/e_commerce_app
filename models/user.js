const Joi = require("joi");
const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });
const db = require("../db");

module.exports = class UserModel {
  constructor(data = {}) {
    this.email = data.email;
    this.password = data.password;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.phone = data.phone;
    this.facebook = data.facebook;
    this.google = data.google;
    this.created = data.created || moment.utc().toISOString();
    this.modified = moment.utc().toISOString();
    this.is_admin = data.is_admin ? "true" : "false";
  }
  /**
   * Creates a new user record
   * @return {Object|null}      [Created user record]
   */
  async create() {
    try {
      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert({ ...this }, null, "users") + "RETURNING *";

      // Execute SQL statment
      const result = await db.query(statement);

      if (result.rows.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates a user record
   * @param  {Object}      data [User data]
   * @return {Object|null}      [Updated user record]
   */
  static async update(id, data) {
    try {
      // Add current date and time for modifiled property
      data.modified = moment.utc().toISOString();

      // Generate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement = pgp.helpers.update(data, null, "users") + condition;

      // Execute SQL statment
      const result = await db.query(statement);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Removes a user record with given ID
   * @param {String} id [User ID]
   * @return {Object | null} [Deleted user record]
   */
  static async delete(id) {
    try {
      // Generate SQL statement
      const statement = `DELETE FROM users WHERE id = $1 RETURNING *`;
      const values = [id];

      const result = await db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Finds a user record by email
   * @param  {String}      email [Email address]
   * @return {Object|null}       [User record]
   */
  static async findOneByEmail(email) {
    try {
      // Generate SQL statement
      const statement = `SELECT *
                         FROM users
                         WHERE email = $1`;
      const values = [email];

      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Finds a user record by ID
   * @param  {String}      id [User ID]
   * @return {Object|null}    [User Record]
   */
  static async findOneById(id) {
    try {
      // Generate SQL statement
      const statement = `SELECT * FROM users WHERE id = $1`;
      const values = [id];

      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async findAll() {
    try {
      const statement = "SELECT * FROM users";

      const result = await db.query(statement);

      if (result.rows.length) return result.rows;

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateUser(user) {
    const schema = Joi.object({
      email: Joi.string().email().trim().required(),
      password: Joi.string().min(6).required(),
      first_name: Joi.string().max(50).required(),
      last_name: Joi.string().max(50).required(),
      phone: Joi.string().min(10).max(13).optional(),
      google: Joi.string().optional(),
      facebook: Joi.string().optional(),
      created: Joi.date().optional(),
      modified: Joi.date().optional(),
      is_admin: Joi.boolean().required(),
    });
    return schema.validate(user);
  }
};
