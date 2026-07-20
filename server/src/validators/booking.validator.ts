import { z } from "zod";

export const createBookingSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  scheduledAt: z.string().datetime("Invalid date format"),
  description: z.string().optional(),
  serviceAddress: z.string().min(1, "Service address is required"),
});

export const updateBookingStatusSchema = z.object({
  cancelReason: z.string().optional(),
});
