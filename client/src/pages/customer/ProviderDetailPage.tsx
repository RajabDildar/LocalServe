import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/services/provider.api";
import { useServices } from "@/hooks/useServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type IService } from "@/types/service.types";
import PageLoader from "@/components/common/PageLoader";

const PRICING_LABEL: Record<IService["pricingType"], string> = {
  fixed: "",
  hourly: "/ hour",
  custom: "Custom quote",
};

export const ProviderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => providerApi.getById(id!),
    enabled: !!id,
  });
  const { data: servicesRes, isLoading: servicesLoading } = useServices(id);

  if (isLoading) return <PageLoader />;
  if (!response?.data) return <div className="p-6">Provider not found.</div>;

  const provider = response.data;
  const services = servicesRes?.data ?? [];

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-3xl font-bold">{provider.userId.name}</h1>
      <p className="mb-6 text-lg text-muted-foreground">{provider.bio}</p>
      <div className="mb-6 rounded-lg bg-muted p-4">
        <h2 className="mb-2 font-semibold">Details</h2>
        <p>Service radius: {provider.serviceRadius} km</p>
        <p>
          Rating: {provider.avgRating.toFixed(1)} ({provider.reviewCount}{" "}
          reviews)
        </p>
      </div>
      <h2 className="mb-3 text-xl font-semibold">Services</h2>
      {servicesLoading && (
        <p className="text-muted-foreground">Loading services...</p>
      )}
      {!servicesLoading && services.length === 0 && (
        <p className="text-muted-foreground">
          This provider hasn't listed any services yet.
        </p>
      )}
      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{service.title}</CardTitle>
                <Badge variant="secondary">
                  {service.pricingType === "custom"
                    ? PRICING_LABEL.custom
                    : `$${service.price ?? 0} ${PRICING_LABEL[service.pricingType]}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
