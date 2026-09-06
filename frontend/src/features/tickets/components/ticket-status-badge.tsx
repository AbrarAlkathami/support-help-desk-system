import { Badge } from "@/components/ui/badge";

import type { TicketStatus } from "@/features/tickets/types/ticket";

type TicketStatusBadgeProps = {
  status: TicketStatus;
};

const styles: Record<TicketStatus, string> = {
  open: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",

  in_progress:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",

  resolved:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",

  closed:
    "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
};

const labels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </Badge>
  );
}
