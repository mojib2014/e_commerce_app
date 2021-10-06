const express = require("express");
const router = express.Router();
const Address = require("../models/address");
const auth = require("../middlewares/auth");

// Retrieve an addresses record by user ID
router.get("/user", auth, async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const address = await Address.getAddressByUserId(user_id);

    if (!address)
      return res
        .status(404)
        .send("An address with the given user ID was not found!");

    res.send(address);
  } catch (err) {
    next(err);
  }
});

// Creates a new address record for given user
router.post("/add", auth, async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = Address.validateAddress(data);
    if (error) return res.status(400).send(error.details[0].message);

    const addressInstance = new Address(data);
    const address = await addressInstance.create(data);

    res.send(address);
  } catch (err) {
    next(err);
  }
});

// Updates an existing address record for a given user
router.put("/update", auth, async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const data = req.body;

    const { error } = Address.validateAddress(data);
    if (error) return res.status(400).send(error.details[0].message);

    const address = await Address.update(user_id, data);

    res.send(address);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
