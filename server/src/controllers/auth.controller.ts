import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import User from "../models/User";
import * as authService from "../services/auth.service";
import * as emailService from "../services/email.service";
import { env } from "../config/env";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "User already exists");

  const passwordHash = await authService.hashPassword(password);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    phone,
    verificationToken: crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex"),
  });

  await emailService.sendVerificationEmail(email, verificationToken);

  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "User registered. Please verify your email.",
      data: { userId: user._id },
    }),
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (
    !user ||
    !(await authService.comparePassword(password, user.passwordHash))
  ) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) throw new ApiError(401, "Please verify your email");

  if (!user.isActive) throw new ApiError(401, "Your account has been suspended");

  const accessToken = authService.generateAccessToken(user);
  const refreshToken = authService.generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Login successful",
      data: {
        accessToken,
        user: { id: user._id, name: user.name, role: user.role },
      },
    }),
  );
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json(new ApiResponse({ statusCode: 200, data: (req as any).user }));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  if (typeof token !== "string") {
    throw new ApiError(400, "Invalid verification token");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({ verificationToken: hashedToken });
  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Email verified successfully. You can now log in.",
    }),
  );
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
    await user.save();

    await emailService.sendPasswordResetEmail(email, resetToken);
  }

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "If that email address is in our system, we have sent a password reset link.",
    }),
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  if (typeof token !== "string") {
    throw new ApiError(400, "Invalid or expired password reset token");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired password reset token");
  }

  user.passwordHash = await authService.hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Password reset successful. You can now log in with your new password.",
    }),
  );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  let decoded: { id: string };
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new ApiError(401, "User not found or suspended");
  }

  const newAccessToken = authService.generateAccessToken(user);

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Access token refreshed",
      data: { accessToken: newAccessToken },
    }),
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Logged out successfully",
    }),
  );
});
