import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { providerApi } from "@/services/provider.api";

const profileSchema = z.object({
  bio: z.string().max(1000),
  serviceRadius: z.number().min(1).max(100),
});

export const ProfileSetupPage = () => {
  const { coords, loading } = useGeolocation();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!coords) return;
    const payload = {
      ...data,
      location: { type: "Point" as const, coordinates: [coords.lng, coords.lat] as [number, number] },
    };
    try {
      await providerApi.updateProfile(payload);
      // Handle success (e.g., redirect or toast)
      console.log("Profile saved successfully");
    } catch (error) {
      console.error("Failed to save profile", error);
      // Handle error (e.g., toast notification)
    }
  };

  if (loading) return <div>Detecting location...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Setup Profile</h1>
      <textarea {...register("bio")} placeholder="Bio" className="w-full border p-2" />
      <input type="number" {...register("serviceRadius", { valueAsNumber: true })} placeholder="Radius (km)" className="w-full border p-2" />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
};
