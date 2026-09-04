import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../services/booking.api";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingService.list().then((res) => res.data),
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingService.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useAcceptBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingService.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useStartBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
