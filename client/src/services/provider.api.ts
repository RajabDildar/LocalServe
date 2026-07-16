import { api } from "./api";
import { type IProvider } from "../types/provider.types.ts";

export interface GetNearbyProvidersParams {
  lat: number;
  lng: number;
  radius?: number;
  categoryId?: string;
  minRating?: number;
}

export interface IUpdateProfile {
  bio: string;
  serviceRadius: number;
  location: { type: "Point"; coordinates: [number, number] };
}

export const providerApi = {
  getNearby: async (
    params: GetNearbyProvidersParams,
  ): Promise<{ success: boolean; data: IProvider[] }> => {
    return api.get("/providers", { params });
  },
  getById: async (
    id: string,
  ): Promise<{ success: boolean; data: IProvider }> => {
    return api.get(`/providers/${id}`);
  },
  updateProfile: async (
    data: IUpdateProfile,
  ): Promise<{ success: boolean; data: IProvider }> => {
    return api.put("/providers/profile", data);
  },
};
