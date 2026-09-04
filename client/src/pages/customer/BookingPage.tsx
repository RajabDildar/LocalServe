import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const bookingSchema = z.object({
  scheduledAt: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  serviceAddress: z.string().min(5, "Address is required"),
});

export const BookingPage = () => {
  const { providerId, serviceId } = useParams();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      scheduledAt: "",
      description: "",
      serviceAddress: "",
    },
  });

  const onSubmit = (data: z.infer<typeof bookingSchema>) => {
    if (!providerId || !serviceId) return;
    createBooking.mutate(
      { providerId, serviceId, ...data },
      {
        onSuccess: () => {
          toast.success("Booking requested!");
          navigate("/dashboard/bookings");
        },
        onError: (err: any) => toast.error(err.message || "Failed to book"),
      },
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Request Service</h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <Controller
          control={form.control}
          name="scheduledAt"
          render={({ field, fieldState }) => (
            <Field>
              <Label>Date & Time</Label>
              <Input type="datetime-local" {...field} />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field>
              <Label>Details</Label>
              <Textarea {...field} />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="serviceAddress"
          render={({ field, fieldState }) => (
            <Field>
              <Label>Service Address</Label>
              <Input {...field} />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Button type="submit" disabled={createBooking.isPending}>
          {createBooking.isPending ? "Requesting..." : "Submit Booking"}
        </Button>
      </form>
    </div>
  );
};
