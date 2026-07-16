import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { protect, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { rejectProviderSchema } from "../validators/provider.validator";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/providers/pending", adminController.getPendingProviders);
router.put("/providers/:id/approve", adminController.approveProvider);
router.put(
  "/providers/:id/reject",
  validate(rejectProviderSchema),
  adminController.rejectProvider,
);

export default router;
