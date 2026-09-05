"use client";

import { useQuery } from "@tanstack/react-query";
import { getQueueSummary } from "../api/get-queue-summary";

export function useQueueSummary() {
  return useQuery({
    queryKey: ["queue-summary"],
    queryFn: getQueueSummary,
  });
}