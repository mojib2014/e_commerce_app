const express = require("express");
const router = express.Router();
const CategoryService = require("../services/categoryService");

const categorySservice = new CategoryService();

// Retrieve all categories records
router.get("/", async (req, res, next) => {
  try {
    const categories = await categorySservice.getAll();

    res.send(categories);
  } catch (err) {
    next(err);
  }
});

// Retrieve a category record by a given ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categorySservice.getCategoryById(id);

    res.send(category);
  } catch (err) {
    next(err);
  }
});

// Create a new category record
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const category = await categorySservice.create(data);

    res.send(category);
  } catch (err) {
    next(err);
  }
});

// Update a record in categories by a given ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const category = await categorySservice.update(id, data);

    res.send(category);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
