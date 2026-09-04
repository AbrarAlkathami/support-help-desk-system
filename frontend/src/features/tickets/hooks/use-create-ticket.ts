// features/tickets/hooks/use-create-ticket.ts

"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createTicket } from "@/features/tickets/api/create-ticket";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
}