import { Request, Response } from 'express';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import User from '../models/User';
import * as authService from '../services/auth.service';
import * as emailService from '../services/email.service';
import { env } from '../config/env';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, 'User already exists');

  const passwordHash = await authService.hashPassword(password);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    phone,
    verificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
  });

  await emailService.sendVerificationEmail(email, verificationToken);

  res.status(201).json(new ApiResponse({
    statusCode: 201,
    message: 'User registered. Please verify your email.',
    data: { userId: user._id }
  }));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await authService.comparePassword(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isVerified) throw new ApiError(401, 'Please verify your email');

  const accessToken = authService.generateAccessToken(user);
  const refreshToken = authService.generateRefreshToken(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json(new ApiResponse({
    statusCode: 200,
    message: 'Login successful',
    data: { accessToken, user: { id: user._id, name: user.name, role: user.role } }
  }));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json(new ApiResponse({ statusCode: 200, data: (req as any).user }));
});
