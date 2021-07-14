const express = require("express");
const auth = require("../routes/auth");
const users = require("../routes/users");
const addresses = require("../routes/addresses");
const categories = require("../routes/categories");
const products = require("../routes/products");
const orders = require("../routes/orders");
const carts = require("../routes/carts");
const cartItems = require("../routes/cartItems");
const passportLoader = require("./passport");

module.exports = (app) => {
  app.use(express.json());
  auth(app, passportLoader(app));
  app.use("/users", users);
  app.use("/addresses", addresses);
  app.use("/categories", categories);
  app.use("/products", products);
  app.use("/orders", orders);
  app.use("carts", carts);
  app.use("/cartItems", cartItems);
};
