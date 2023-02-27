import express from 'express';
import { isAdmin, isAuth } from '@/utils.js';
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getSummary,
  getSummaryByUser,
  getUserOrders,
  updateToDelivered,
  updateToPaid,
} from '@/controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get('/summary', isAuth, isAdmin, getSummary);
orderRouter.get('/', isAuth, isAdmin, getSummaryByUser);
orderRouter.get('/myorders', isAuth, getUserOrders);
orderRouter.get('/:id', isAuth, getOrderById);
orderRouter.post('/', isAuth, createOrder);
orderRouter.put('/:id', isAuth, updateToPaid);
orderRouter.put('/:id', isAuth, updateToDelivered);
orderRouter.delete('/:id', isAuth, deleteOrder);

export default orderRouter;
