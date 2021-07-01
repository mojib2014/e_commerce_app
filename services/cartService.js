const createError = require("http-errors");
const CartModel = require("../models/cart");
const OrderModel = require("../models/order");
const CartItemModel = require("../models/cartItem");

module.exports = class CartService {
  async create(data) {
    const { userId } = data;
    try {
      const cartInstance = new CartModel();
      const cart = await cartInstance.create(userId);
    } catch (err) {
      throw err;
    }
  }

  async loadCart(userId) {
    try {
      // Load user cart by the given ID
      const cart = await CartModel.findOneByUser(userId);

      // Load cart items and add them to the cart record
      const items = await CartItemModel.find(cart.id);
      cart.items = items;

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async addItem(userId, item) {
    try {
      // Load user cart with a given ID
      const cart = await CartModel.findOneByUser(userId);

      // Create cart item
      const cartItem = await CartItemModel.create({ cartId: cart.id, ...item });

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async removeItem(cartItemId) {
    try {
      // Remove cart item by ID
      const cartItem = await CartItemModel.delete(cartItemId);

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async updateItem(cartItemId, data) {
    try {
      // Update cart item by ID
      const cartItem = await CartItemModel.update(cartItemId, data);

      return cartItem;
    } catch (err) {
      throw err;
    }
  }

  async checkout(cartId, userId, paymentInfo) {
    try {
      const stripe = require("stripe")("sk_test_FOY6txFJqPQvJJQxJ8jpeLYQ");

      // Load cart items
      const cartItems = await CartItemModel.find(cartId);

      // Generate total price from cart items
      const total = cartItems.reduce((total, item) => {
        return (total += Number(item.price));
      }, 0);

      // Generate initial order
      const orderInstance = new OrderModel({ total, userId });
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
