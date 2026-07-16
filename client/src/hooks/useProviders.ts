import { useQuery } from "@tanstack/react-query";
import {
  providerApi,
  type GetNearbyProvidersParams,
} from "../services/provider.api";

export const useProviders = (
  params: GetNearbyProvidersParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["providers", params],
    queryFn: () => providerApi.getNearby(params),
    enabled,
  });
};
