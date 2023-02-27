import jwt from 'jsonwebtoken';
import config from './config.js';

export const generateToken = (user: {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    config.JWT_SECRET!
  );
};
export const isAuth = (
  req: { headers: { authorization: any }; user: any },
  res: {
    status: (
      arg0: number
    ) => {
      (): any;
      new (): any;
      send: { (arg0: { message: string }): void; new (): any };
    };
  },
  next: () => void
) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).send({ message: 'Token is not supplied' });
  } else {
    const token = bearerToken.slice(7, bearerToken.length);
    jwt.verify(token, config.JWT_SECRET!, (err: any, data: any) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = data;
        next();
      }
    });
  }
};
export const isAdmin = (
  req: { user: { isAdmin: any } },
  res: {
    status: (
      arg0: number
    ) => {
      (): any;
      new (): any;
      send: { (arg0: { message: string }): void; new (): any };
    };
  },
  next: () => void
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Token is not valid for admin user' });
  }
};
