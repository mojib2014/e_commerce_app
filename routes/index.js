const authRouter = require("./auth");
const cartRouter = require("./carts");
const orderRouter = require("./orders");
const productRouter = require("./products");
const categoriesRouter = require("./categories");
const userRouter = require("./users");

module.exports = (app, passport) => {
  authRouter(app, passport);
  cartRouter(app);
  orderRouter(app);
  productRouter(app);
  categoriesRouter(app);
  userRouter(app);
};
