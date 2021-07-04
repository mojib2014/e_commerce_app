const createError = require("http-errors");
const CartModel = require("../models/cart");
const OrderModel = require("../models/order");
const CartItemModel = require("../models/cartItem");

module.exports = class CartService {
  // Creates a new cart record
  async create(data) {
    try {
      const cartInstance = new CartModel(data);
      const cart = await cartInstance.create();

      return cart;
    } catch (err) {
      throw err;
    }
  }

  // Updates an existing record by a given ID
  async updateItem(cartItemId, data) {
    try {
      const cartItem = await CartItemModel.update(cartItemId, data);

      if (!cartItem)
        throw createError(404, "No cartItem was found with given ID!");

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  // Load user cart by the given ID
  async loadCart(user_id) {
    try {
      const cart = await CartModel.findOneByUserId(user_id);

      if (!cart)
        throw createError(404, "No cart was found with the given user ID!");

      // Load cart items and add them to the cart record
      const items = await CartItemModel.find(cart.id);

      if (!items)
        throw createError(404, "No items was found with the given cart ID!");

      cart.items = items;

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async addItem(user_id, item) {
    try {
      // Load user cart with a given ID
      const cart = await CartModel.findOneByUserId(user_id);

      if (!cart) throw createError(404, "No cart with the given ID was found!");
      // Create cart item
      const cartItem = await CartItemModel.create({
        cart_id: cart.id,
        ...item,
      });

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async removeItem(cartItemId) {
    try {
      // Remove cart item by ID
      const cartItem = await CartItemModel.delete(cartItemId);

      if (!cartItem)
        throw createError(404, "No cartItem was found with the given ID!");

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async checkout(cart_id, user_id, paymentInfo) {
    try {
      const stripe = require("stripe")("sk_test_FOY6txFJqPQvJJQxJ8jpeLYQ");

      // Load cart items
      const cartItems = await CartItemModel.find(cart_id);

      if (!cartItems)
        throw createError(404, "No cartItems was found with the given ID!");
      // Generate total price from cart items
      const total = cartItems.reduce((total, item) => {
        return (total += Number(item.price));
      }, 0);

      // Generate initial order
      const orderInstance = new OrderModel({ total, user_id });
      orderInstance.addItems(cartItems);
      await orderInstance.create();

      // Make charge to payment method (not required in the project)
      const charge = await stripe.charges.create({
        amount: total,
        currency: "usd",
        source: paymentInfo.id,
        description: "E-commerce Charge",
      });

      // On successful charge to payment method, update order status to complete
      const order = orderInstance.update({ status: "COMPLETE" });

      return order;
    } catch (err) {
      throw err;
    }
  }
};
