const express = require("express");
const router = express.Router();
const db = require("../db/index");

// get all orders
router.get("/", (req, res) => {
  try {
    const query = "SELECT * FROM orders";
    db.query(query, [], (err, result) => {
      if (err) return res.status(400).send(err.message);
      res.send(result.rows);
    });
  } catch (error) {
    console.log(error.message);
  }
});

// get an order with the given id
router.get("/:id", (req, res) => {
  try {
    const query = `SELECT * FROM orders WHERE id = ${id}`;
    db.query(query, [], (err, result) => {
      if (err) return res.status(400).send(err.message);
      res.send(result.rows[0]);
    });
  } catch (error) {
    console.log(error.message);
  }
});

// create new order
router.post("/", (req, res) => {
  try {
    const { order_date, user_id, product_id } = req.body;
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
