import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { protect, requireRole } from "../middleware/auth";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/providers/pending", adminController.getPendingProviders);
router.put("/providers/:id/approve", adminController.approveProvider);

export default router;
