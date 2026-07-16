import { useLocationStore } from "@/features/location/locationStore";
import { useLocation } from "@/features/location/useLocation";
import { useProviders } from "@/hooks/useProviders";
import { ProviderCard } from "@/components/common/ProviderCard";

export const HomePage = () => {
  useLocation();
  const { lat, lng } = useLocationStore();
  const categoryId = undefined;

  const { data: response, isLoading } = useProviders(
    { lat: lat || 0, lng: lng || 0, categoryId },
    !!lat && !!lng,
  );

  if (!lat || !lng) {
    return <div className="p-4">Please enable location to find providers.</div>;
  }

  if (isLoading) return <div className="p-4">Loading providers...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Find Local Providers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {response?.data?.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))}
      </div>
    </div>
  );
};
