"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useQueueSummary } from "@/features/tickets/hooks/use-queue-summary";
import { SummaryCard } from "@/features/tickets/components/summary-card";
import { ApiError } from "@/components/shared/api-error";
export function QueueSummary() {
  const { data, isLoading, isError, error } = useQueueSummary();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <ApiError
        variant="alert"
        title="Could not load summary"
        error={error}
        fallback="The queue summary could not be loaded."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard title="Unassigned" value={data?.unassigned ?? 0} />

      <SummaryCard title="Assigned to me" value={data?.assigned_to_me ?? 0} />

      <SummaryCard title="Overdue" value={data?.overdue ?? 0} />
    </div>
  );
}
