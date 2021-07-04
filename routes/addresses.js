const express = require("express");
const router = express.Router();
const AddressService = require("../services/addressService");
const auth = require("../middlewares/auth");

const addressService = new AddressService();

// Retrieve an addresses record by user ID
router.get("/user", auth, async (req, res, next) => {
  try {
    const { id } = req.user;

    const address = await addressService.getAddressByUserId(id);

    res.send(address);
  } catch (err) {
    next(err);
  }
});

// Creates a new address record for given user
router.post("/add", auth, async (req, res, next) => {
  try {
    const data = req.body;

    const address = await addressService.create(data);
    res.send(address);
  } catch (err) {
    next(err);
  }
});

// Updates an existing address record for a given user
router.put("/update", auth, async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = req.body;

    const address = await addressService.update(id, data);
    res.send(address);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
