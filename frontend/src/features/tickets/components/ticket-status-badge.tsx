import { Badge } from "@/components/ui/badge";
import type { TicketStatus } from "../types/ticket";

type TicketStatusBadgeProps = {
  status: TicketStatus;
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const styles: Record<TicketStatus, string> = {
    open: "border-blue-200 bg-blue-50 text-blue-700",
    in_progress: "border-amber-200 bg-amber-50 text-amber-700",
    resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    closed: "border-zinc-200 bg-zinc-50 text-zinc-600",
  };

  const labels: Record<TicketStatus, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
}
