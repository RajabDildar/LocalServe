import { Types } from "mongoose";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import Booking from "../models/Booking";
import * as emailService from "../services/email.service";
import * as bookingService from "../services/booking.service";
import User from "../models/User";

interface BookingParams {
  id: string;
}

interface CancelBookingBody {
  cancelReason: string;
}

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { providerId, serviceId, scheduledAt, description, serviceAddress } =
      req.body;
    const customerId = req.user._id as Types.ObjectId;

    const booking = await Booking.create({
      customerId,
      providerId,
      serviceId,
      scheduledAt,
      description,
      serviceAddress,
      status: "pending",
    });

    const provider = await User.findById(providerId);
    if (provider) {
      await emailService.sendBookingRequestEmail(
        provider.email,
        booking._id.toString(),
      );
    }

    res
      .status(201)
      .json(
        new ApiResponse({
          statusCode: 201,
          data: booking,
          message: "Booking requested successfully.",
        }),
      );
  },
);

export const listBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user._id as Types.ObjectId;
    const role = req.user.role;

    const query =
      role === "customer" ? { customerId: userId } : { providerId: userId };
    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json(
      new ApiResponse({
        statusCode: 200,
        data: bookings,
        message: "Bookings retrieved.",
      }),
    );
  },
);

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) throw new ApiError(404, "Booking not found");

  if (
    booking.customerId.toString() !== req.user._id.toString() &&
    booking.providerId.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Not authorized");
  }

  res.json(
    new ApiResponse({
      statusCode: 200,
      data: booking,
      message: "Booking details retrieved.",
    }),
  );
});

export const acceptBooking = asyncHandler(
  async (req: Request<BookingParams>, res: Response) => {
    const booking = await bookingService.handleAcceptBooking(
      req.params.id,
      req.user._id,
    );
    res.json(
      new ApiResponse({
        statusCode: 200,
        data: booking,
        message: "Booking accepted.",
      }),
    );
  },
);

export const rejectBooking = asyncHandler(
  async (req: Request<BookingParams>, res: Response) => {
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      req.user._id,
      "provider",
      "rejected",
      ["pending"],
    );

    const customer = await User.findById(booking.customerId);
    if (customer)
      await emailService.sendBookingRejectedEmail(
        customer.email,
        booking._id.toString(),
      );

    res.json(
      new ApiResponse({
        statusCode: 200,
        data: booking,
        message: "Booking rejected.",
      }),
    );
  },
);

// For cancelBooking, we type both the Params (1st generic) and the Body (3rd generic)
export const cancelBooking = asyncHandler(
  async (
    req: Request<BookingParams, any, CancelBookingBody>,
    res: Response,
  ) => {
    const { cancelReason } = req.body; // Properly typed as string now
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found");

    let allowed = false;
    if (req.user.role === "customer" && booking.status === "pending")
      allowed = true;
    if (
      req.user.role === "provider" &&
      ["accepted", "paid"].includes(booking.status)
    )
      allowed = true;

    if (!allowed)
      throw new ApiError(
        400,
        "Cannot cancel this booking in its current state.",
      );

    booking.status = "cancelled";
    booking.cancelReason = cancelReason;
    await booking.save();

    const otherParty = await User.findById(
      req.user.role === "customer" ? booking.providerId : booking.customerId,
    );
    if (otherParty)
      await emailService.sendBookingCancelledEmail(
        otherParty.email,
        booking._id.toString(),
      );

    res.json(
      new ApiResponse({
        statusCode: 200,
        data: booking,
        message: "Booking cancelled.",
      }),
    );
  },
);

export const startBooking = asyncHandler(
  async (req: Request<BookingParams>, res: Response) => {
    await bookingService.updateBookingStatus(
      req.params.id,
      req.user._id,
      "provider",
      "in_progress",
      ["accepted"],
    );
    res.json(new ApiResponse({ statusCode: 200, message: "Booking started." }));
  },
);

export const completeBooking = asyncHandler(
  async (req: Request<BookingParams>, res: Response) => {
    await bookingService.updateBookingStatus(
      req.params.id,
      req.user._id,
      "provider",
      "completed",
      ["in_progress"],
    );
    res.json(
      new ApiResponse({ statusCode: 200, message: "Booking completed." }),
    );
  },
);

export const confirmBooking = asyncHandler(
  async (req: Request<BookingParams>, res: Response) => {
    await bookingService.updateBookingStatus(
      req.params.id,
      req.user._id,
      "customer",
      "confirmed",
      ["completed"],
    );
    res.json(
      new ApiResponse({ statusCode: 200, message: "Booking confirmed." }),
    );
  },
);
