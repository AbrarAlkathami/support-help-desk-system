import type { TicketStatus } from "@/features/tickets/types/ticket";

interface TicketSlaProps {
  dueAt: string;
  isOverdue: boolean;
  status: TicketStatus;
}

export function TicketSla({ dueAt, isOverdue, status }: TicketSlaProps) {
  if (status === "resolved" || status === "closed") {
    return <span className="text-sm text-muted-foreground">Completed</span>;
  }

  const difference = new Date(dueAt).getTime() - Date.now();

  const absoluteMinutes = Math.ceil(Math.abs(difference) / (1000 * 60));

  const hours = Math.floor(absoluteMinutes / 60);

  const minutes = absoluteMinutes % 60;

  const time = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  if (isOverdue) {
    return (
      <span className="text-sm font-medium text-destructive">
        Overdue by {time}
      </span>
    );
  }

  return <span className="text-sm text-muted-foreground">Due in {time}</span>;
}
