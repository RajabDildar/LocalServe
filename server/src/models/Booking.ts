import { Schema, model, Document, Types } from "mongoose";
import { BOOKING_STATUSES } from "../utils/constants";

export interface IBooking extends Document {
  customerId: Types.ObjectId;
  providerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  status: string;
  scheduledAt: Date;
  description?: string;
  serviceAddress?: string;
  totalAmount?: number;
  platformFee?: number;
  providerAmount?: number;
  paymentIntentId?: string;
  autoReleaseAt?: Date;
  cancelReason?: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    status: { type: String, enum: BOOKING_STATUSES, default: "pending" },
    scheduledAt: { type: Date, required: true },
    description: { type: String },
    serviceAddress: { type: String },
    totalAmount: { type: Number },
    platformFee: { type: Number },
    providerAmount: { type: Number },
    paymentIntentId: { type: String },
    autoReleaseAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true },
);

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ paymentIntentId: 1 });

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
