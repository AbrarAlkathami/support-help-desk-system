import { apiClient } from "@/lib/api/api-client";

import type { Metrics } from "../types/metrics";

type MetricsApiResponse = {
  total_tickets: number;

  by_status: {
    status: string;
    count: number;
  }[];

  by_category: {
    category: string;
    count: number;
  }[];
};

export async function getMetrics(): Promise<Metrics> {
  const response =
    await apiClient<MetricsApiResponse>(
      "/metrics",
    );

  return {
    totalTickets: response.total_tickets,

    byStatus: response.by_status.map(
      (item) => ({
        status: item.status,
        count: item.count,
      }),
    ),

    byCategory: response.by_category.map(
      (item) => ({
        category: item.category,
        count: item.count,
      }),
    ),
  };
}