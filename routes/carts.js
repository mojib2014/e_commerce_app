const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Cart = require("../models/cart");

// Retrieve a cart by a given ID
router.get("/:id", [auth], async (req, res, next) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOneById(id);

    if (!cart) return res.status(404).send("A cart by given ID was not found!");

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Retrieve users cart by given ID
router.get("/mine", [auth], async (req, res, next) => {
  try {
    const { id } = req.user;

    const cart = await Cart.findOneByUserId(id);

    if (!cart)
      return res.status(404).send("A cart by given user ID was not found!");

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Creates a new cart record for a given user
router.post("/mine/add", [auth], async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = Cart.validateCart(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartInstance = new Cart(data);

    const cart = await cartInstance.create(data);

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Updates a cart record and carItem record by a user ID and cartItem ID
router.put("/mine/update", [auth], async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = req.body;

    const { error } = Cart.validateCart(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cart = Cart.findOneByUserId(id);
    if (!cart)
      return res.status(404).send("A cart by a given user ID was not found!");

    await Cart.updateCart(cart.id, data);

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

    const { error } = Cart.validateCart(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartItem = await Cart.addCartItem(id, data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Updates a cartItem by a given ID
router.put("/mine/items/:cartItemId", [auth], async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const data = req.body;

    const { error } = Cart.validateCart(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartItem = await Cart.updateItem(cartItemId, data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Removes a cartItem by a given ID
router.delete("/mine/items/:cartItemId", [auth], async (req, res, next) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await Cart.removeItem(cartItemId);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

router.post("/mine/checkout", [auth], async (req, res, next) => {
  try {
    const { id } = req.user;

    const { cart_id, paymentInfo } = req.body;

    const response = await Cart.checkout(cart_id, id, paymentInfo);

    res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
