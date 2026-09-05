import { Badge } from "@/components/ui/badge";
import type { TicketPriority } from "@/features/tickets/types/ticket";

type TicketPriorityBadgeProps = {
  priority: TicketPriority;
};

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const styles: Record<TicketPriority, string> = {
    low: "border-zinc-200 bg-zinc-50 text-zinc-600",
    medium: "border-blue-200 bg-blue-50 text-blue-700",
    high: "border-orange-200 bg-orange-50 text-orange-700",
    urgent: "border-red-200 bg-red-50 text-red-700",
  };

  const labels: Record<TicketPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return (
    <Badge variant="secondary" className={styles[priority]}>
      {labels[priority]}
    </Badge>
  );
}
