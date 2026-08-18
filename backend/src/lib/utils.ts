import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';

export const generateToken = (userID: Types.ObjectId, res: Response): string => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    secure: process.env.NODE_ENV !== 'development',
  });

  return token;
};
