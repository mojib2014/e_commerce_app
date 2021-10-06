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
router.get("/:product_id", async (req, res, next) => {
  try {
    const { product_id } = req.params;

    const product = await productService.getProductById(product_id);

    if (!product)
      return res
        .status(404)
        .send("A product with the given product_id was not found!");

    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Retrieve a product by a given category ID
router.get("/category/:category_id", async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const product = await productService.getProductByCategoryId(category_id);

    if (!product)
      return res
        .status(404)
        .send("Product(s) with the given category_id was not found!");

    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Retrieve a product by a given user ID
router.get("/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const products = await productService.getProductsByUserId(user_id);

    if (!products)
      return res
        .status(404)
        .send("Product(s) with the given user_id was not found!");

    res.send(products);
  } catch (err) {
    next(err);
  }
});

// Create a new product
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
router.put("/:product_id", async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const data = req.body;

    const product = await productService.update(product_id, data);

    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Remove a product by a given ID
router.delete("/:product_id", async (req, res, next) => {
  try {
    const { product_id } = req.params;

    const product = await productService.remove(product_id);

    if (!product)
      return res
        .status(404)
        .send("A product with the given product_id was not found!");

    res.send(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
