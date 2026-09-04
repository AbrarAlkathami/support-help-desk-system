"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { addComment } from "@/features/tickets/api/add-comment";

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) =>
      addComment({
        ticketId,
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticket", ticketId],
      });
    },
  });
}