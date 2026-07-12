import { Schema, model, Document, Types } from 'mongoose';

export interface IService extends Document {
  providerId: Types.ObjectId;
  title: string;
  description: string;
  categoryId: Types.ObjectId;
  subcategory?: string;
  pricingType: 'fixed' | 'hourly' | 'custom';
  price?: number;
  images: string[];
  isActive: boolean;
}

const serviceSchema = new Schema<IService>({
  providerId: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String },
  pricingType: { type: String, enum: ['fixed', 'hourly', 'custom'], required: true },
  price: { type: Number },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.index({ providerId: 1, categoryId: 1 });

const Service = model<IService>('Service', serviceSchema);

export default Service;
