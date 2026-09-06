import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";

import type { Ticket } from "@/features/tickets/types/ticket";

interface UserTicketTableProps {
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

export function UserTicketTable({
  tickets,
  onTicketClick,
}: UserTicketTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table className="w-full table-fixed">
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40%] px-4">Ticket</TableHead>

            <TableHead className="w-[13%] px-4">Status</TableHead>

            <TableHead className="w-[13%] px-4">Priority</TableHead>

            <TableHead className="w-[18%] px-4">Category</TableHead>

            <TableHead className="w-[16%] px-4">Created</TableHead>
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
              className="h-[72px] cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/50 focus-visible:outline-none"
            >
              {/* Ticket */}
              <TableCell className="px-4 py-4 align-middle">
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="min-w-0 cursor-default">
                      <p className="truncate text-sm font-semibold">
                        {ticket.subject}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {ticket.id}
                      </p>
                    </div>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="top"
                    align="start"
                    className="w-auto max-w-[320px] px-3 py-2"
                  >
                    <p className="text-sm font-medium">{ticket.subject}</p>

                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {ticket.id}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>

              {/* Status */}
              <TableCell className="px-4 py-4 align-middle">
                <TicketStatusBadge status={ticket.status} />
              </TableCell>

              {/* Priority */}
              <TableCell className="px-4 py-4 align-middle">
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>

              {/* Category */}
              <TableCell className="px-4 py-4 align-middle">
                <HoverCard>
                  <HoverCardTrigger>
                    <p className="truncate text-sm text-muted-foreground">
                      {ticket.category.name}
                    </p>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="top"
                    className="w-auto max-w-[240px] px-3 py-2"
                  >
                    <p className="text-sm">{ticket.category.name}</p>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>

              {/* Created */}
              <TableCell className="px-4 py-4 align-middle">
                <div>
                  <p className="whitespace-nowrap text-sm">
                    {formatTicketDate(ticket.createdAt)}
                  </p>

                  <p className="mt-1 whitespace-nowrap text-xs text-muted-foreground">
                    {formatTicketTime(ticket.createdAt)}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
