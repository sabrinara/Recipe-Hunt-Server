import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';


export const authenticate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Verify token (assuming JWT_SECRET is in environment variables)
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
 // Attach user info to request object (req.user)
  req.user = { id: decoded.id, role: decoded.role };
  next();
});

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};