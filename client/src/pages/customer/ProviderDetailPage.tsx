import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/services/provider.api";

export const ProviderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => providerApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!response?.data) return <div>Provider not found.</div>;

  const provider = response.data;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{provider.userId.name}</h1>
      <p className="text-lg text-gray-700 mb-6">{provider.bio}</p>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Details</h2>
        <p>Service Radius: {provider.serviceRadius} km</p>
        <p>Rating: {provider.avgRating} ({provider.reviewCount} reviews)</p>
      </div>
    </div>
  );
};
