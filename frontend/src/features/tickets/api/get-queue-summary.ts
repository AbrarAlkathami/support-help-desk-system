import { apiClient } from "@/lib/api/api-client";

export type QueueSummary = {
    unassigned: number;
    assigned_to_me: number;
    overdue: number;
  };

export async function getQueueSummary(){
    const response = await apiClient<QueueSummary>(
      `/tickets/queue-summary`,
    );
    return response
}