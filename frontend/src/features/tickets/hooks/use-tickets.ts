"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTickets } from "@/features/tickets/api/get-tickets";
import type { TicketsQueryParams } from "@/features/tickets/types/ticket";

export function useTickets(params: TicketsQueryParams) {
    return useQuery({
      queryKey: ["tickets", params],
      queryFn: () => getTickets(params),
      placeholderData: keepPreviousData,
    });
  }