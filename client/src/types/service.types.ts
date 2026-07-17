export interface IService {
  _id: string;
  providerId: string;
  title: string;
  description: string;
  categoryId: string;
  subcategory?: string;
  pricingType: "fixed" | "hourly" | "custom";
  price?: number | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  subcategories: string[];
  isActive: boolean;
}
