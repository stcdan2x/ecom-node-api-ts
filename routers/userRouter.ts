import {
  createAdmin,
  createUser,
  loginUser,
  updateProfile,
  updateUser,
} from '@/controllers/userController.js';
import { isAdmin, isAuth } from '@/utils.js';
import express from 'express';

const userRouter = express.Router();

userRouter.get('/createadmin', createAdmin); // DO NOT DEPLOY to production

userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);
userRouter.put('/profile', isAuth, updateProfile);
userRouter.put('/:id', isAuth, isAdmin, updateUser);
