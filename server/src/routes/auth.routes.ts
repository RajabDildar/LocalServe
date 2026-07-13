import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refresh);
router.post("/logout", authController.logout);
router.get("/verify-email/:token", authController.verifyEmail);
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
router.get("/me", protect, authController.getMe);

export default router;
