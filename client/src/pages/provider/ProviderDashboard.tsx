import {
  useBookings,
  useAcceptBooking,
  useRejectBooking,
  useStartBooking,
  useCompleteBooking,
} from "@/hooks/useBooking";
import { BookingCard } from "@/components/common/BookingCard";
import { Button } from "@/components/ui/button";

export const ProviderDashboard = () => {
  const { data: bookings, isLoading } = useBookings();
  const accept = useAcceptBooking();
  const reject = useRejectBooking();
  const start = useStartBooking();
  const complete = useCompleteBooking();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Provider Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookings?.data.map((b) => (
          <BookingCard
            key={b._id}
            booking={b}
            actions={
              <>
                {b.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => accept.mutate(b._id)}>
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => reject.mutate(b._id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {b.status === "accepted" && (
                  <Button size="sm" onClick={() => start.mutate(b._id)}>
                    Start Work
                  </Button>
                )}
                {b.status === "in_progress" && (
                  <Button size="sm" onClick={() => complete.mutate(b._id)}>
                    Complete
                  </Button>
                )}
              </>
            }
          />
        ))}
      </div>
    </div>
  );
};
