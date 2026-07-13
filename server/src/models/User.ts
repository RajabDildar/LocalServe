import { Schema, model, Document } from "mongoose";
import { AVAILABLE_ROLES } from "../utils/constants";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "customer" | "provider" | "admin";
  phone?: string;
  avatar?: string; // Cloudinary URL
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: AVAILABLE_ROLES, required: true },
    phone: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

// Indexes
// userSchema.index({ email: 1 });

const User = model<IUser>("User", userSchema);

export default User;
