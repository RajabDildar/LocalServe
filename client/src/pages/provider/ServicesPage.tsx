import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { providerApi } from "@/services/provider.api";
import { serviceApi, type IServiceInput } from "@/services/service.api";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import { ServiceForm } from "@/components/common/ServiceForm";
import { type IService } from "@/types/service.types";
import PageLoader from "@/components/common/PageLoader";

const PRICING_LABEL: Record<IService["pricingType"], string> = {
  fixed: "Fixed",
  hourly: "/ hour",
  custom: "Custom quote",
};

export const ServicesPage = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: profileRes, isLoading: profileLoading } = useQuery({
    queryKey: ["myProviderProfile"],
    queryFn: () => providerApi.getMyProfile(),
    retry: false,
  });
  const providerId = profileRes?.data?._id;

  const { data: categoriesRes } = useCategories();
  const categories = categoriesRes?.data ?? [];

  const { data: servicesRes, isLoading: servicesLoading } =
    useServices(providerId);
  const services = servicesRes?.data ?? [];

  const invalidateServices = () =>
    queryClient.invalidateQueries({ queryKey: ["services", providerId] });

  const handleCreate = async (values: IServiceInput) => {
    try {
      await serviceApi.create(values);
      toast.success("Service added");
      setIsAdding(false);
      invalidateServices();
    } catch (err) {
      toast.error(
        (err as { message?: string })?.message || "Failed to add service",
      );
    }
  };

  const handleUpdate = async (id: string, values: IServiceInput) => {
    try {
      await serviceApi.update(id, values);
      toast.success("Service updated");
      setEditingId(null);
      invalidateServices();
    } catch (err) {
      toast.error(
        (err as { message?: string })?.message || "Failed to update service",
      );
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Remove this service from your listings?")) return;
    try {
      await serviceApi.deactivate(id);
      toast.success("Service removed");
      invalidateServices();
    } catch (err) {
      toast.error(
        (err as { message?: string })?.message || "Failed to remove service",
      );
    }
  };

  if (profileLoading) return <PageLoader />;

  if (!providerId) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <p className="text-muted-foreground">
          Set up your provider profile before adding services.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage services</h1>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>Add service</Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>New service</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm
              categories={categories}
              submitLabel="Add service"
              onSubmit={handleCreate}
              onCancel={() => setIsAdding(false)}
            />
          </CardContent>
        </Card>
      )}

      {servicesLoading && (
        <p className="text-muted-foreground">Loading services...</p>
      )}
      {!servicesLoading && services.length === 0 && !isAdding && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No services added yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {services.map((service) =>
          editingId === service._id ? (
            <Card key={service._id}>
              <CardHeader>
                <CardTitle>Edit service</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceForm
                  categories={categories}
                  submitLabel="Save changes"
                  defaultValues={{
                    title: service.title,
                    description: service.description,
                    categoryId: service.categoryId,
                    subcategory: service.subcategory ?? "",
                    pricingType: service.pricingType,
                    price: service.price ?? undefined,
                  }}
                  onSubmit={(values) => handleUpdate(service._id, values)}
                  onCancel={() => setEditingId(null)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card key={service._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {service.pricingType === "custom"
                      ? PRICING_LABEL.custom
                      : `$${service.price ?? 0} ${PRICING_LABEL[service.pricingType]}`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(service._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeactivate(service._id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </div>
  );
};
