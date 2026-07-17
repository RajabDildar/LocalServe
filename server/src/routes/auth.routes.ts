import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
} from "../validators/auth.validator";
import { protect } from "../middleware/auth";
import {
  authLimiter,
  resendVerificationLimiter,
} from "../middleware/rateLimiter";

const router = Router();

router.get("/me", protect, authController.getMe);
router.post("/refresh-token", authController.refresh);

router.use(authLimiter);

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/verify-email/:token", authController.verifyEmail);
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationLimiter,
  authController.resendVerification,
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
