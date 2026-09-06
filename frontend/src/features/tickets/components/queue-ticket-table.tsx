import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserIdentity } from "@/components/shared/user-identity";

import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { TicketAssigneeBadge } from "@/features/tickets/components/ticket-assignee-badge";
import { TicketRowActions } from "@/features/tickets/components/ticket-row-actions";
import { TicketSla } from "@/features/tickets/components/ticket-sla";

import type { Ticket } from "@/features/tickets/types/ticket";

interface QueueTicketTableProps {
  tickets: Ticket[];

  onTicketClick: (ticketId: string) => void;
}

function formatTicketDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTicketTime(date: string) {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function QueueTicketTable({
  tickets,
  onTicketClick,
}: QueueTicketTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[240px] px-4">Ticket</TableHead>

            <TableHead className="min-w-[160px] px-4">Requester</TableHead>

            <TableHead className="px-4">Status</TableHead>

            <TableHead className="px-4">Priority</TableHead>

            <TableHead className="min-w-[140px] px-4">Category</TableHead>

            <TableHead className="min-w-[160px] px-4">Assignee</TableHead>

            <TableHead className="min-w-[130px] px-4">Created</TableHead>

            <TableHead className="min-w-[120px] px-4">SLA</TableHead>

            <TableHead className="w-[52px] px-3">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              tabIndex={0}
              onClick={() => onTicketClick(ticket.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onTicketClick(ticket.id);
                }
              }}
              className="h-[76px] cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/50 focus-visible:outline-none"
            >
              <TableCell className="px-4 py-4 align-middle">
                <div className="max-w-[320px]">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {ticket.subject}
                  </p>

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {ticket.id}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <UserIdentity name={ticket.requester.name} />
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <TicketStatusBadge status={ticket.status} />
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <span className="text-sm text-muted-foreground">
                  {ticket.category.name}
                </span>
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <TicketAssigneeBadge assignee={ticket.assignee} />
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <div>
                  <p className="whitespace-nowrap text-sm">
                    {formatTicketDate(ticket.createdAt)}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatTicketTime(ticket.createdAt)}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <TicketSla
                  dueAt={ticket.slaDueAt}
                  isOverdue={ticket.isOverdue}
                  status={ticket.status}
                />
              </TableCell>

              <TableCell
                className="px-3 py-4 align-middle"
                onClick={(event) => event.stopPropagation()}
              >
                <TicketRowActions
                  ticket={ticket}
                  onOpen={() => onTicketClick(ticket.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
