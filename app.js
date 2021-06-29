const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const { PORT } = require("./config");

const users = require("./routes/users.js");
const orders = require("./routes/orders");
const products = require("./routes/products");
const categories = require("./routes/categories");

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", users);
app.use("/orders", orders);
app.use("/products", products);
app.use("/categories", categories);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

module.exports = app;
