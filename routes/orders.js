const express = require("express");
const router = express.Router();

const OrderService = require("../services/orderService");
const orderService = new OrderService();

module.exports = (app) => {
  app.use("/orders", router);
  // Get all orders
  router.get("/", async (req, res, next) => {
    try {
      const orders = await orderService.getAllOrders();
      res.send(orders);
    } catch (error) {
      console.log(error.message);
    }
  });

  // Get an order with the given id
  router.get("/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await orderService.findById(orderId);
      res.send(order);
    } catch (error) {
      console.log(error.message);
    }
  });

  // Get user orders with user_id column
  router.get("/user-orders/:userId", async (req, res, next) => {
    try {
      const { userId } = req.params;
      const orders = await orderService.getUserOrders(userId);
      res.send(orders);
    } catch (err) {
      next(err);
    }
  });

  // create new order
  router.post("/", async (req, res) => {
    try {
      const data = req.body;

      const order = await orderService.create(data);
      res.send(order);
    } catch (error) {
      console.log(error);
    }
  });
};
