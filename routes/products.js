const express = require("express");
const router = express.Router();
const ProductService = require("../services/productService");

const service = new ProductService();

// Get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await service.list();

    res.send(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await service.getProductByUserId(id);

    res.send(products);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {});

router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const product = await service.create(data);
    if (!product) return res.status(400).send("Could not insert a new record!");

    res.send(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
