const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");

// Retrieve a cart by a given ID
router.get("/:cart_id", [auth], async (req, res, next) => {
  try {
    const { cart_id } = req.params;

    const cart = await Cart.findOneById(cart_id);

    if (!cart) return res.status(404).send("A cart by given ID was not found!");

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Retrieve users cart by given ID
router.get("/cart/mine", [auth], async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const cart = await Cart.findOneByUserId(user_id);

    if (!cart)
      return res.status(404).send("A cart by given user ID was not found!");

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Creates a new cart record for a given user
router.post("/cart/add", [auth], async (req, res, next) => {
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
router.put("/cart/update", [auth], async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const data = req.body;

    const { error } = Cart.validateCart(data);
    if (error) return res.status(400).send(error.details[0].message);

    let cart = await Cart.findOneByUserId(user_id);
    if (!cart)
      return res.status(404).send("A cart by a given user ID was not found!");

    cart = await Cart.updateCart(cart.cart_id, data);

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

// Creates a new cart item for a specific cart
router.post("/items/new", [auth], async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const data = req.body;

    const { error } = CartItem.validateCartItem(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartItem = await Cart.addCartItem(user_id, data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Updates a cart_item by a given ID
router.put("/items/:cart_item_id", [auth], async (req, res, next) => {
  try {
    const { cart_item_id } = req.params;
    const data = req.body;

    const { error } = CartItem.validateCartItem(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartItem = await Cart.updateItem(cart_item_id, data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Removes a cartItem by a given ID
router.delete("/items/:cart_item_id", [auth], async (req, res, next) => {
  try {
    const { cart_item_id } = req.params;

    const cartItem = await Cart.removeCartItemItem(cart_item_id);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

router.post("/checkout", [auth], async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const { cart_id, paymentInfo } = req.body;

    const response = await Cart.checkout(cart_id, user_id, paymentInfo);

    res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
