import { useQuery } from "@tanstack/react-query";
import { serviceApi } from "@/services/service.api";

export const useServices = (providerId: string | undefined) => {
  return useQuery({
    queryKey: ["services", providerId],
    queryFn: () => serviceApi.listByProvider(providerId as string),
    enabled: !!providerId,
  });
};
