import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/services/category.api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
    staleTime: 5 * 60 * 1000,
  });
};
