import Bad_Request from "../errors/Bad_Request.js";
import NotFound from "../errors/NotFound.js";
import { StatusCodes } from "http-status-codes";
import Order from "../Model/Order.js";
import Product from "../Model/Product.js";
import { checkPermissions } from "../utils/checkPermissions.js";

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "SomeRandomValue";
  return { client_secret, amount };
};

export const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new Bad_Request("Please provide cart item");
  }
  if (!tax || !shippingFee) {
    throw new Bad_Request("Please provide both tax and shipping fee");
  }
  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const productItem = await Product.findOne({ _id: item.product });
    if (!productItem) {
      throw new NotFound(`No Product with Id : ${item.product}`);
    }
    const { name, price, image, _id } = productItem;
    const singleOrderItem = {
      name,
      image,
      price,
      amount: item.amount,
      product: item.product,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "usd",
  });
  const order = await Order.create({
    orderItems,
    total,
    tax,
    shippingFee,
    subtotal,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
export const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFound(`No Product with Id : ${item.product}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};
export const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
export const getCurrentUserOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ order });
};
export const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFound(`No Product with Id : ${item.product}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
