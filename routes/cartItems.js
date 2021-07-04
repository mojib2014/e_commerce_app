const express = require("express");
const router = express.Router();
const CartItemService = require("../services/cartItemService");

const cartItemService = new CartItemService();

// Retrieve a cartItem by a given ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const cartItem = await cartItemService.getCartItemById(id);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Create a new CartItem record
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;

    const cartItem = await cartItemService.create(data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

// Update an existing cartItem record by a given ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const cartItem = await cartItemService.update(id, data);

    res.send(cartItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
