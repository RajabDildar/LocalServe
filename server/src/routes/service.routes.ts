import { Router } from "express";
import * as serviceController from "../controllers/service.controller";
import { protect, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { serviceSchema } from "../validators/provider.validator";

const router = Router();

router.get("/provider/:providerId", serviceController.listByProvider);
router.post(
  "/",
  protect,
  requireRole("provider"),
  validate(serviceSchema),
  serviceController.create,
);
router.put(
  "/:id",
  protect,
  requireRole("provider"),
  validate(serviceSchema),
  serviceController.update,
);
router.delete(
  "/:id",
  protect,
  requireRole("provider"),
  serviceController.deactivate,
);

export default router;
