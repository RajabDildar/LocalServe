import { useBookings, useCancelBooking } from "@/hooks/useBooking";
import { BookingCard } from "@/components/common/BookingCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const BookingsDashboard = () => {
  const { data: bookings, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();

  const handleCancel = (id: string) => {
    cancelBooking.mutate({ id, reason: "Customer requested cancellation" }, {
      onSuccess: () => toast.success("Booking cancelled"),
      onError: (err: any) => toast.error(err.message),
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookings?.data.map((b) => (
          <BookingCard
            key={b._id}
            booking={b}
            actions={
              b.status === "pending" && (
                <Button variant="destructive" size="sm" onClick={() => handleCancel(b._id)}>
                  Cancel
                </Button>
              )
            }
          />
        ))}
      </div>
    </div>
  );
};
