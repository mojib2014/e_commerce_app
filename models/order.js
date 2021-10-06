const db = require("../db");
const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });
const Joi = require("joi");
const OrderItem = require("./orderItem");

module.exports = class OrderModel {
  constructor(data = {}) {
    this.total = data.total || 0;
    this.status = data.status || "PENDING";
    this.order_date = data.order_date || moment.utc().toISOString();
    this.modified = moment.utc().toISOString();
    this.user_id = data.user_id || null;
    this.items = data.items || [];
  }

  /**
   * Addes new items to the orderItems table
   * @param {Object} [items]
   * @returns {Object|null} [Created orderItem record]
   */
  static addItems(items) {
    this.items = items.map((item) => new OrderItem(item));
  }

  /**
   * Creates a new order for a user
   * @return {Object|null}  [Created order record]
   */
  static async create() {
    try {
      const { order_date, modified, status, total, user_id } = this;

      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert(
          { order_date, modified, status, total, user_id },
          null,
          "orders",
        ) + " RETURNING *";

      // Execute SQL statment
      const result = await db.query(statement);

      if (result.rows.length) {
        // Add new information generated in the database (ie: id) to the Order instance properties
        Object.assign(this, result.rows[0]);

        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates an order for a user
   * @param  {Object}      id   [Order ID]
   * @param  {Object}      data [Order data to update]
   * @return {Object|null}      [Updated order record]
   */
  static async update() {
    try {
      const { order_date, user_id, total, modified, status } = this;
      // Generate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", {
        id: this.id,
      });
      const statement =
        pgp.helpers.update(
          { order_date, user_id, total, modified, status },
          null,
          "orders",
        ) + condition;

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
   * Loads orders for a user
   * @param  {number} userId [User ID]
   * @return {Array}         [Order records]
   */
  static async findByUserId(userId) {
    try {
      // Generate SQL statement
      const statement = `SELECT *
                         FROM orders
                         WHERE "user_id" = $1`;
      const values = [userId];

      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieve order by ID
   * @param  {number}      orderId [Order ID]
   * @return {Object|null}         [Order record]
   */
  static async findById(orderId) {
    try {
      // Generate SQL statement
      const statement = `SELECT *
                         FROM orders
                         WHERE id = $1`;
      const values = [orderId];

      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieve all order records
   * @return {Array|[]} [Order records]
   */
  static async list() {
    try {
      const statement = `SELECT * FROM orders`;

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return [];
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateOrder(order) {
    const schema = Joi.object({
      total: Joi.number().min(0).required(),
      status: Joi.string().min(5).max(50).required(),
      order_date: Joi.date(),
      modified: Joi.date(),
      user_id: Joi.number().min(1).required(),
    });

    return schema.validate(order);
  }
};
