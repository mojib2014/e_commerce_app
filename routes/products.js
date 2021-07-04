const express = require("express");
const router = express.Router();
const ProductService = require("../services/productService");

const productService = new ProductService();

// Retrieve all products
router.get("/", async (req, res, next) => {
  try {
    const products = await productService.list();

    res.send(products);
  } catch (err) {
    next(err);
  }
});

// Retrieve a product by a given ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Retrieve a product by a given category ID
router.get("/category/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByCategoryId(id);

    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Retrieve a product by a given user ID
router.get("/user/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await productService.getProductsByUserId(id);

    res.send(products);
  } catch (err) {
    next(err);
  }
});

// Add a new product
router.post("/", async (req, res, next) => {
  const data = req.body;
  try {
    const product = await productService.create(data);

    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Update a product by a given ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await productService.update(id, data);

    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Remove a product by a given ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productService.remove(id);

    res.send(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
