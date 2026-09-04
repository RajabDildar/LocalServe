import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type IBooking } from "@/types/booking.types";
import { format } from "date-fns";

interface BookingCardProps {
  booking: IBooking;
  actions?: React.ReactNode;
}

const getStatusColor = (status: IBooking["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "accepted":
      return "bg-blue-500";
    case "paid":
      return "bg-green-500";
    case "in_progress":
      return "bg-purple-500";
    case "completed":
      return "bg-indigo-500";
    case "confirmed":
      return "bg-emerald-500";
    case "cancelled":
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  actions,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Booking #{booking._id.slice(-6)}
        </CardTitle>
        <Badge className={`${getStatusColor(booking.status)} text-white`}>
          {booking.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Scheduled: {format(new Date(booking.scheduledAt), "PPP p")}
          </p>
          <p className="text-sm">{booking.description}</p>
        </div>
        {actions && <div className="mt-4 flex gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
};
