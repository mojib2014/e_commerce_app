const express = require("express");
const router = express.Router();
const CartService = require("../services/cartService");
const auth = require("../middlewares/auth");

const cartService = new CartService();

// Retrieve a cart for a given user (ID)
router.get("/mine", [auth], async (req, res, next) => {
  try {
    const { id } = req.user;

    const cart = await cartService.loadCart(id);

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Creates a new cart record
router.post("/mine", [auth], async (req, res, next) => {
  try {
    const data = req.body;
    const cart = await cartService.create(data);

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Updates a cart record by a user ID
router.put("/mine", [auth], async (req, res, next) => {
  try {
    const { id } = req.user;
    const cart = await cartService.updateItem({ id });
    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Creates a new cart item for a specific cart
router.post("/mine/items", [auth], async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = req.body;

    const cartItem = await cartService.addItem(id, data);
    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

router.put("/mine/items/:cartItemId", [auth], async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const data = req.body;

    const cartItem = await cartService.updateItem(cartItemId, data);
    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

router.delete("/mine/items/:cartItemId", [auth], async (req, res, next) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await cartService.removeItem(cartItemId);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

router.post("/mine/checkout", [auth], async (req, res, next) => {
  try {
    const { id } = req.user;

    const { cart_id, paymentInfo } = req.body;

    const response = await cartService.checkout(cart_id, id, paymentInfo);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
