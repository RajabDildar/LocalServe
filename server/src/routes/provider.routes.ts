import { Router } from "express";
import * as providerController from "../controllers/provider.controller";
import { protect, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { providerProfileSchema } from "../validators/provider.validator";

const router = Router();

router.get("/", providerController.getNearby);
router.get(
  "/profile",
  protect,
  requireRole("provider"),
  providerController.getMyProfile,
);
router.get("/:id", providerController.getById);
router.put(
  "/profile",
  protect,
  requireRole("provider"),
  validate(providerProfileSchema),
  providerController.createOrUpdateProfile,
);
router.put(
  "/availability",
  protect,
  requireRole("provider"),
  providerController.toggleAvailability,
);

export default router;
