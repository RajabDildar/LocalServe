import { api } from "./api";
import { type IBooking } from "../types/booking.types";
import { type ApiResponse } from "../types/api.types";

export interface CreateBookingDto {
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  description: string;
  serviceAddress: string;
}

export const bookingService = {
  create: (data: CreateBookingDto) =>
    api.post<ApiResponse<IBooking>>("/bookings", data),

  list: () => api.get<ApiResponse<IBooking[]>>("/bookings"),

  getById: (id: string) => api.get<ApiResponse<IBooking>>(`/bookings/${id}`),

  accept: (id: string) =>
    api.patch<ApiResponse<IBooking>>(`/bookings/${id}/accept`),

  reject: (id: string) =>
    api.patch<ApiResponse<IBooking>>(`/bookings/${id}/reject`),

  cancel: (id: string, cancelReason: string) =>
    api.patch<ApiResponse<IBooking>>(`/bookings/${id}/cancel`, {
      cancelReason,
    }),

  start: (id: string) => api.patch<ApiResponse<void>>(`/bookings/${id}/start`),

  complete: (id: string) =>
    api.patch<ApiResponse<void>>(`/bookings/${id}/complete`),

  confirm: (id: string) =>
    api.patch<ApiResponse<void>>(`/bookings/${id}/confirm`),
};
