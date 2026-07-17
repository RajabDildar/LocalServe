import { api } from "./api";
import { type IService } from "../types/service.types";

export interface IServiceInput {
  title: string;
  description: string;
  categoryId: string;
  subcategory?: string;
  pricingType: "fixed" | "hourly" | "custom";
  price?: number | null;
}

export const serviceApi = {
  listByProvider: async (
    providerId: string,
  ): Promise<{ success: boolean; data: IService[] }> =>
    api.get(`/services/provider/${providerId}`),
  create: async (
    data: IServiceInput,
  ): Promise<{ success: boolean; data: IService }> =>
    api.post("/services", data),
  update: async (
    id: string,
    data: IServiceInput,
  ): Promise<{ success: boolean; data: IService }> =>
    api.put(`/services/${id}`, data),
  deactivate: async (
    id: string,
  ): Promise<{ success: boolean; data: IService }> =>
    api.delete(`/services/${id}`),
};
