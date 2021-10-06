const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// Retrieve all orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.list();

    if (!orders.length)
      return res.status(404).send("No orders, Orders table is empty!");

    res.send(orders);
  } catch (err) {
    next(err);
  }
});

// Retrieve an order with the given ID
router.get("/:order_id", async (req, res, next) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id);

    if (!order)
      return res.status(404).send("An order with the given ID was not found!");

    res.send(order);
  } catch (err) {
    next(err);
  }
});

// Retrieve user orders by user_id column
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const orders = await Order.findByUserId(user_id);

    if (!orders)
      return res.status(404).send("There are no orders for the given user!");

    res.send(orders);
  } catch (err) {
    next(err);
  }
});

// create new order
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const { error } = Order.validateOrder(data);
    if (error) return res.status(400).send(error.details[0].message);

    const orderInstance = new Order(data);
    const order = await orderInstance.create();

    res.send(order);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
