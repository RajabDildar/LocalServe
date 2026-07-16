import { Schema, model, Document, Types } from "mongoose";

export interface IProviderProfile extends Document {
  userId: Types.ObjectId;
  bio?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  serviceRadius: number; // in km
  isApproved: boolean;
  isRejected: boolean;
  rejectionReason?: string;
  isAvailable: boolean;
  avgRating: number;
  reviewCount: number;
  stripeAccountId?: string;
  portfolioImages: string[];
}

const providerProfileSchema = new Schema<IProviderProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, maxlength: 1000 },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    serviceRadius: { type: Number, required: true }, // in km
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    rejectionReason: { type: String },
    isAvailable: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stripeAccountId: { type: String },
    portfolioImages: [{ type: String }],
  },
  { timestamps: true },
);

// CRITICAL: 2dsphere index enables $near and $geoWithin queries
providerProfileSchema.index({ location: "2dsphere" });
providerProfileSchema.index({ isApproved: 1, isAvailable: 1 });

const ProviderProfile = model<IProviderProfile>(
  "ProviderProfile",
  providerProfileSchema,
);

export default ProviderProfile;
