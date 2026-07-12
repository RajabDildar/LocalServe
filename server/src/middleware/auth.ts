import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/User';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new ApiError(401, 'Not authenticated');

  const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
  const user = await User.findById(decoded.id).select('-passwordHash');

  if (!user || !user.isActive) throw new ApiError(401, 'User not found or suspended');

  (req as any).user = user;
  next();
});

export const requireRole = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!roles.includes((req as any).user.role)) {
    throw new ApiError(403, 'Forbidden');
  }
  next();
};
