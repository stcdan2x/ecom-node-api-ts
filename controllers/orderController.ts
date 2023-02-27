import Order from '@/models/orderModel.js';
import Product from '@/models/productModel.js';
import User from '@/models/userModel.js';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({
    users,
    orders: orders.length === 0 ? [{ numOrders: 0, totalSales: 0 }] : orders,
    dailyOrders,
    productCategories,
  });
});

// get all orders by specific user using a currently logged in admin account
export const getSummaryByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate('user');
    res.send(orders);
  }
);

// get all user orders for a currently logged in user account
export const getUserOrders = asyncHandler(
  async (req: Request | any, res: Response) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  }
);

// get specific user order by ID
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  }
);

export const createOrder = asyncHandler(
  async (req: Request | any, res: Response) => {
    const order = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: 'New Order Created', order: createdOrder });
  }
);

export const updateToPaid = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.payment!.paymentResult = {
        payerID: req.body.payerID,
        paymentID: req.body.paymentID,
        orderID: req.body.orderID,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found.' });
    }
  }
);

export const updateToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found.' });
    }
  }
);

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const deletedOrder = await order.remove();
    res.send({ message: 'Order Deleted', product: deletedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});
