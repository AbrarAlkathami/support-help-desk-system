"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateTicket,
  type UpdateTicketData,
} from "@/features/tickets/api/update-ticket";

export function useUpdateTicket(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTicketData) =>
      updateTicket(ticketId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticket", ticketId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["queue-summary"],
      });
    },
  });
}