import { Badge } from "@/components/ui/badge";

import type { TicketPriority } from "@/features/tickets/types/ticket";

type TicketPriorityBadgeProps = {
  priority: TicketPriority;
};

const styles: Record<TicketPriority, string> = {
  low: "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",

  medium:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",

  high: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300",

  urgent:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
};

const labels: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[priority]}`}
    >
      {labels[priority]}
    </Badge>
  );
}
