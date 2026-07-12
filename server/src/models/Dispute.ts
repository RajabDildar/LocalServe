import { Schema, model, Document, Types } from 'mongoose';
import { DISPUTE_STATUSES, DISPUTE_REASONS } from '../utils/constants';

export interface IDispute extends Document {
  bookingId: Types.ObjectId;
  raisedBy: Types.ObjectId;
  reason: string;
  description: string;
  status: string;
  adminNote?: string;
  refundAmount?: number;
  resolvedAt?: Date;
  resolvedBy?: Types.ObjectId;
}

const disputeSchema = new Schema<IDispute>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, enum: DISPUTE_REASONS, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: DISPUTE_STATUSES, default: 'open' },
  adminNote: { type: String },
  refundAmount: { type: Number },
  resolvedAt: { type: Date },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Dispute = model<IDispute>('Dispute', disputeSchema);

export default Dispute;
