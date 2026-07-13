import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  subcategories: string[];
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String },
    subcategories: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Category = model<ICategory>("Category", categorySchema);

export default Category;
