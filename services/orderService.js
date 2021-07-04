const createError = require("http-errors");
const OrderModel = require("../models/order");

module.exports = class OrderService {
  async create(data) {
    try {
      const orderInstance = new OrderModel(data);
      const order = await orderInstance.create();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async update(data) {
    try {
      const orderInstance = new OrderModel(data);
      const order = await orderInstance.update();

      return order;
    } catch (err) {
      throw err;
    }
  }

  async getAllOrders() {
    try {
      const orders = await OrderModel.list();

      return orders;
    } catch (err) {
      throw err;
    }
  }

  async getUserOrders(userId) {
    try {
      const orders = await OrderModel.findByUser(userId);

      if (!orders) throw createError(404, "No orders");

      return orders;
    } catch (err) {
      throw err;
    }
  }

  async findById(orderId) {
    try {
      const order = await OrderModel.findById(orderId);

      if (!order)
        throw createError(404, "No order with the given ID was found!");

      return order;
    } catch (err) {
      throw err;
    }
  }
};
