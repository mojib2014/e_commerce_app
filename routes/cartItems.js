const express = require("express");
const router = express.Router();
const CartItem = require("../models/cartItem");
const auth = require("../middlewares/auth");

// Retrieve a cart_item by a given ID
router.get("/:cart_item_id", auth, async (req, res, next) => {
  try {
    const { cart_item_id } = req.params;

    const cartItem = await CartItem.find(cart_item_id);

    if (!cartItem)
      return res
        .status(404)
        .send("A CartItem with the given ID was not found!");

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Creates a new CartItem record
router.post("/", auth, async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = CartItem.validateCartItem(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartItem = await CartItem.create(data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Update an existing cartItem record by a given ID
router.put("/:cart_item_id", auth, async (req, res, next) => {
  try {
    const { cart_item_id } = req.params;
    const data = req.body;

    const { error } = CartItem.validateCartItem(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartItem = await CartItem.update(cart_item_id, data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

router.delete("/:cart_item_id", auth, async (req, res, next) => {
  try {
    const { cart_item_id } = req.params;

    const cartItem = CartItem.delete(cart_item_id);

    if (!cartItem)
      return res
        .status(404)
        .send("A cartItem with the given ID was not found!");

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
