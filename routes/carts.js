const express = require("express");
const router = express.Router();
const CartService = require("../services/cartService");

const cartService = new CartService();

module.exports = (app, passport) => {
  app.use("/carts", router);

  router.get("/mine", async (req, res, next) => {
    try {
      const { id } = req.user;
      const cart = await cartService.loadCart(id);

      res.send(cart);
    } catch (err) {
      next(err);
    }
  });

  router.put("/mine", async (req, res, next) => {
    try {
      const { id } = req.user;
      const cart = await cartService.update({ id });
      res.send(cart);
    } catch (err) {
      next(err);
    }
  });

  router.post("/mine", async (req, res, next) => {
    try {
      const { id } = req.user;
      const cart = await cartService.create({ userId: id });
      res.send(cart);
    } catch (err) {
      next(err);
    }
  });

  router.post("/mine/items", async (req, res, next) => {
    try {
      const { id } = req.user;
      const data = req.body;

      const cartItem = await cartService.addItem(id, data);
      res.send(cartItem);
    } catch (err) {
      next(err);
    }
  });

  router.put("/mine/items/:cartItemId", async (req, res, next) => {
    try {
      const { cartItemId } = req.params;
      const data = req.body;

      const cartItem = await cartService.updateItem(cartItemId, data);
      res.send(cartItem);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/mine/items/:cartItemId", async (req, res, next) => {
    try {
      const { cartItemId } = req.params;

      const cartItem = await cartService.removeItem(cartItemId);
    } catch (err) {
      next(err);
    }
  });

  router.post("/mine/checkout", async (req, res, next) => {
    try {
      const { id } = req.user;

      const { cartId, paymentInfo } = req.body;

      const response = await cartService.checkout(cartId, id, paymentInfo);
      res.send(response);
    } catch (err) {
      next(err);
    }
  });
};
