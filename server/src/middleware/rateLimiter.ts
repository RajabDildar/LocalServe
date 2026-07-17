import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later. api limit",
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resendVerificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1,
  message: {
    success: false,
    message: "Too many verification requests. Please try again in 5 minutes.",
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});
