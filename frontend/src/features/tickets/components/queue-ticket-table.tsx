import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { TicketAssigneeBadge } from "@/features/tickets/components/ticket-assignee-badge";
import { TicketRowActions } from "@/features/tickets/components/ticket-row-actions";
import type { Ticket } from "@/features/tickets/types/ticket";

interface QueueTicketTableProps {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
}

export function QueueTicketTable({
  tickets,
  onTicketClick,
}: QueueTicketTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-white/35 shadow-sm backdrop-blur-[2px]">
      <Table>
        <TableHeader className="bg-white/25">
          <TableRow className="border-b border-black/10 hover:bg-transparent">
            <TableHead>Subject</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-60px">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              onClick={() => onTicketClick(ticket.id)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onTicketClick(ticket.id);
                }
              }}
              className="
                  cursor-pointer
                  transition-colors
                  hover:bg-[#F2A88D]/20
                  focus-visible:bg-[#F2CFC2]/50
                  focus-visible:outline-none
                "
            >
              <TableCell className="font-medium">{ticket.subject}</TableCell>

              <TableCell>{ticket.requester.name}</TableCell>

              <TableCell>
                <TicketStatusBadge status={ticket.status} />
              </TableCell>

              <TableCell>
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>

              <TableCell>{ticket.category.name}</TableCell>

              <TableCell>
                <TicketAssigneeBadge assignee={ticket.assignee} />
              </TableCell>
              <TableCell>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
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
