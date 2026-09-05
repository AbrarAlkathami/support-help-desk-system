"use client";

import { useQuery } from "@tanstack/react-query";

import { getMetrics } from "@/features/metrics/api/get-metrics";

export function useMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
  });
}