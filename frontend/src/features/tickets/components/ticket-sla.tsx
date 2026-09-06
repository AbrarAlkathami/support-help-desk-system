import type { TicketStatus } from "@/features/tickets/types/ticket";

interface TicketSlaProps {
  dueAt: string;
  isOverdue: boolean;
  status: TicketStatus;
}

export function TicketSla({ dueAt, isOverdue, status }: TicketSlaProps) {
  if (status === "resolved" || status === "closed") {
    return (
      <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        Completed
      </span>
    );
  }

  const difference = new Date(dueAt).getTime() - Date.now();

  const absoluteMinutes = Math.ceil(Math.abs(difference) / (1000 * 60));

  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  const time = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  if (isOverdue) {
    return (
      <span className="inline-flex whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        Overdue · {time}
      </span>
    );
  }

  if (absoluteMinutes <= 60) {
    return (
      <span className="inline-flex whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
        Due soon · {time}
      </span>
    );
  }

  return (
    <span className="inline-flex whitespace-nowrap rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
      Due in {time}
    </span>
  );
}
