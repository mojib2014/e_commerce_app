const express = require("express");
const router = express.Router();
const CategoryService = require("../services/categoryService");

const service = new CategoryService();

module.exports = (app) => {
  app.use("/categories", router);

  router.get("/", async (req, res, next) => {
    try {
      const categories = await service.getAll();

      res.send(categories);
    } catch (err) {
      next(err);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = req.body;
      const category = await service.create(data);

      res.send(category);
    } catch (err) {
      next(err);
    }
  });
};
