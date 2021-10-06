const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const auth = require("../middlewares/auth");

// Retrieve all categories records
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.findAll();

    if (!categories) return res.status(404).send("No categories were found!");

    res.send(categories);
  } catch (err) {
    next(err);
  }
});

// Retrieve a category record by a given ID
router.get("/:category_id", auth, async (req, res, next) => {
  try {
    const { category_id } = req.params;

    const category = await Category.findCategoryById(category_id);

    if (!category)
      return res
        .status(404)
        .send("A category with the given ID was not found!");

    res.send(category);
  } catch (err) {
    next(err);
  }
});

// Create a new category record
router.post("/", auth, async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = Category.validateCategory(data);
    if (error) return res.status(400).send(error.details[0].message);

    const categoryInstance = new Category(data);
    const category = await categoryInstance.create();

    res.send(category);
  } catch (err) {
    next(err);
  }
});

// Update a record in categories by a given ID
router.put("/:category_id", auth, async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const data = req.body;

    const { error } = Category.validateCategory(data);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.update(category_id, data);

    if (!category)
      return res
        .status(404)
        .send("A category with the given ID was not found!");

    res.send(category);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
