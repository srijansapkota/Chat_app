import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model.js';

interface DecodedToken {
  userID: string;
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.jwt;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.userID).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
