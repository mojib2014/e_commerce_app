const express = require("express");
const router = express.Router();
const CartItem = require("../models/cartItem");
const auth = require("../middlewares/auth");

// Retrieve a cartItem by a given ID
router.get("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.find(id);

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
router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const { error } = CartItem.validateCartItem(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cartItem = await CartItem.update(id, data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const cartItem = CartItem.delete(id);

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
