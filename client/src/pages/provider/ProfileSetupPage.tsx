import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { providerApi } from "@/services/provider.api";
import PageLoader from "@/components/common/PageLoader";

const profileSchema = z.object({
  bio: z.string().max(1000).optional(),
  serviceRadius: z.number().min(1, "Must be at least 1 km").max(100),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileSetupPage = () => {
  const {
    coords,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  const { data: existingProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["myProviderProfile"],
    queryFn: () => providerApi.getMyProfile(),
    retry: false, // a 404 here just means "no profile yet"
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { bio: "", serviceRadius: 10 },
  });

  useEffect(() => {
    if (existingProfile?.data) {
      form.reset({
        bio: existingProfile.data.bio ?? "",
        serviceRadius: existingProfile.data.serviceRadius,
      });
    }
  }, [existingProfile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!coords) {
      toast.error("We need your location before you can save your profile.");
      return;
    }
    try {
      await providerApi.updateProfile({
        ...data,
        bio: data.bio ?? "",
        location: { type: "Point", coordinates: [coords.lng, coords.lat] },
      });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(
        (err as { message?: string })?.message || "Failed to save profile",
      );
    }
  };

  if (locationLoading || profileLoading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider profile</CardTitle>
          <CardDescription>
            This is what customers see when they find you nearby.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {locationError && (
            <p className="mb-4 text-sm text-destructive">
              Couldn't get your location ({locationError}). Enable location
              access in your browser and reload this page.
            </p>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="bio"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder="Tell customers what you do and why they should book you"
                    rows={5}
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="serviceRadius"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Service radius (km)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min={1}
                    max={100}
                    aria-invalid={fieldState.invalid}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FieldDescription>
                    You'll only show up for customers within this distance.
                  </FieldDescription>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || !coords}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
