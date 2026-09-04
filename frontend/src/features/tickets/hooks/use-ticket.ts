"use client";

import { useQuery } from "@tanstack/react-query";

import { getTicket } from "@/features/tickets/api/get-ticket";

export function useTicket(ticketId: string | null) {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicket(ticketId!),
    enabled: !!ticketId,
  });
}