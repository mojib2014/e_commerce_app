const db = require("../db");
const moment = require("moment");
const Joi = require("joi");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class OrderItemModel {
  constructor(data = {}) {
    this.name = data.name;
    this.price = data.price || 0;
    this.quantity = data.quantity;
    this.description = data.description;
    this.created = data.created || moment.utc().toISOString();
    this.modified = moment.utc().toISOString();
    this.order_id = data.order_id;
    this.product_id = data.product_id;
  }

  /**
   * Creates a new order item
   * @param {Object}    data [Order item data]
   * @return {Object|null} [Created order item]
   */
  static async create(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "orderItems") + "RETURNING *";

      const result = await db.query(statement);
      if (result.rows.length) return result.rows[0];

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieve order items for an order
   * @param {String} orderId [Order ID]
   * @return {Array}         [Created cart items]
   */
  static async find(orderId) {
    try {
      const statement = `SELECT oi.quantity,
                                oi.id AS "cartItemId",
                                p.*
                                FROM "orderItems" oi
                                INNER JOIN products p ON p.id = oi."product_id"
                                WHERE "order_id = $1`;
      const values = [orderId];

      const result = await db.query(statement, values);
      if (result.rows.length) return result.rows[0];

      return [];
    } catch (err) {
      throw new Error(err);
    }
  }

  static validateOrderItem(orderItem) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().min(1).required(),
      description: Joi.string().min(5).max(200).required(),
    });

    return schema.validate(orderItem);
  }
};
