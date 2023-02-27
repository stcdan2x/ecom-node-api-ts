import User from '@/models/userModel.js';
import { generateToken } from '@/utils.js';
import asyncHandler from 'express-async-handler';

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

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error(
      'This email already exists, please provide a different email.'
    );
  }

  const user = new User({
    name,
    email,
    password,
    isAdmin: false,
  });

  try {
    const createdUser = await user.save();
    res.send(createdUser);
  } catch (err: any) {
    res.status(401).send({ message: 'invalid user data' });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const signinUser = await User.findOne({ email, password });

  if (!signinUser) {
    res.status(401).send({
      message: 'Invalid Email or Password',
    });
  } else {
    const { _id, name, email, isAdmin } = signinUser;

    res.send({
      _id,
      name,
      email,
      isAdmin,
      token: generateToken(signinUser),
    });
  }
});
