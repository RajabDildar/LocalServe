import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { validate } from "../middleware/validate";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../validators/booking.validator";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);

router.post(
  "/",
  validate(createBookingSchema),
  bookingController.createBooking,
);
router.get("/", bookingController.listBookings);
router.get("/:id", bookingController.getBooking);

router.put("/:id/accept", bookingController.acceptBooking);
router.put("/:id/reject", bookingController.rejectBooking);
router.put(
  "/:id/cancel",
  validate(updateBookingStatusSchema),
  bookingController.cancelBooking,
);
router.put("/:id/start", bookingController.startBooking);
router.put("/:id/complete", bookingController.completeBooking);
router.put("/:id/confirm", bookingController.confirmBooking);

export default router;
