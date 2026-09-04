export interface IBooking {
  _id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  status:
    | "pending"
    | "accepted"
    | "paid"
    | "rejected"
    | "cancelled"
    | "in_progress"
    | "completed"
    | "confirmed"
    | "disputed"
    | "refunded";
  scheduledAt: string;
  description?: string;
  serviceAddress?: string;
  totalAmount?: number;
  platformFee?: number;
  providerAmount?: number;
  paymentIntentId?: string;
  autoReleaseAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}
