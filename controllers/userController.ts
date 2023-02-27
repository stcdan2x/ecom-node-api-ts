import User from '@/models/userModel.js';
import { generateToken } from '@/utils.js';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

// create admin account for testing, DO NOT DEPLOY to production
export const createAdmin = asyncHandler(async (req, res) => {
  try {
    const user = new User({
      name: 'admin',
      email: 'admin@sample.com',
      password: 'adminpass',
      isAdmin: true,
    });
    const createdUser = await user.save();
    res.send(createdUser);
  } catch (err: any) {
    res.status(500).send({ message: err.message });
  }
});

// create a user account
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error(
      'This email already exists, please provide a different email.'
    );
  }

  const user = new User({ name, email, password });

  try {
    const createdUser = await user.save();
    const { _id, name, email, isAdmin } = createdUser;

    res.send({
      _id,
      name,
      email,
      isAdmin,
      token: generateToken(createdUser),
    });
  } catch (err: any) {
    res.status(401).send({ message: 'invalid user data' });
  }
});

// login to user account
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    const { _id, name, email, isAdmin } = user;

    res.send({
      _id,
      name,
      email,
      isAdmin,
      token: generateToken(user),
    });
  } else {
    res.status(401).send({
      message: 'Invalid Email or Password',
    });
  }
});

export const updateProfile = asyncHandler(async (req: Request |any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser: any = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({
      message: 'User Not Found',
    });
  }
});
