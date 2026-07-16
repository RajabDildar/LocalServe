export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "provider" | "admin";
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
