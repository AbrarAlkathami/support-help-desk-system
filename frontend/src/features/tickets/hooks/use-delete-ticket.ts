"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteTicket } from "@/features/tickets/api/delete-ticket";

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTicket,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["ticket"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["metrics"],
      });
    },
  });
}