const authRouter = require("./auth");
const userRouter = require("./users");
const categoriesRouter = require("./categories");
const productRouter = require("./products");
const orderRouter = require("./orders");
const cartRouter = require("./carts");
const cartItemsRouter = require("./cartItems");

module.exports = (app, passport) => {
  authRouter(app, passport);
  userRouter(app);
  categoriesRouter(app);
  productRouter(app);
  orderRouter(app);
  cartRouter(app);
  cartItemsRouter(app);
};
