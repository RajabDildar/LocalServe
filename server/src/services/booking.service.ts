import { Types } from "mongoose";
import Booking from "../models/Booking";
import User from "../models/User";
import Service from "../models/Service";
import { ApiError } from "../utils/ApiError";
import * as emailService from "../services/email.service";
import { PLATFORM_COMMISSION_PERCENT } from "../utils/constants";

export const updateBookingStatus = async (
  id: string,
  userId: Types.ObjectId,
  role: string,
  newStatus: string,
  expectedStatuses: string[],
) => {
  const query: any = { _id: id, status: { $in: expectedStatuses } };
  if (role === "customer") query.customerId = userId;
  if (role === "provider") query.providerId = userId;

  const booking = await Booking.findOneAndUpdate(
    query,
    { status: newStatus },
    { new: true },
  );

  if (!booking) {
    const existing = await Booking.findById(id);
    if (!existing) throw new ApiError(404, "Booking not found");
    throw new ApiError(403, "Not authorized or invalid status transition");
  }

  return booking;
};

export const handleAcceptBooking = async (
  id: string,
  userId: Types.ObjectId,
) => {
  const booking = await updateBookingStatus(
    id,
    userId,
    "provider",
    "accepted",
    ["pending"],
  );

  const service = await Service.findById(booking.serviceId);
  if (service && service.price) {
    booking.totalAmount = service.price;
    booking.platformFee = service.price * (PLATFORM_COMMISSION_PERCENT / 100);
    booking.providerAmount = service.price - booking.platformFee;
    await booking.save();
  }

  const customer = await User.findById(booking.customerId);
  if (customer)
    await emailService.sendBookingAcceptedEmail(
      customer.email,
      booking._id.toString(),
    );

  return booking;
};
