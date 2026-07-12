import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  bookingId: Types.ObjectId;
  customerId: Types.ObjectId;
  providerId: Types.ObjectId;
  rating: number;
  comment?: string;
  providerResponse?: string;
}

const reviewSchema = new Schema<IReview>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 },
  providerResponse: { type: String, maxlength: 500 },
}, { timestamps: true });

reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({ providerId: 1 });

const Review = model<IReview>('Review', reviewSchema);

export default Review;
