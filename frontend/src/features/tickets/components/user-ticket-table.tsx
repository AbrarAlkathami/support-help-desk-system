import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import type { Ticket } from "@/features/tickets/types/ticket";

interface UserTicketTableProps {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
}

export function UserTicketTable({
  tickets,
  onTicketClick,
}: UserTicketTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-white/35 shadow-sm backdrop-blur-[2px]">
      <Table>
        <TableHeader className="bg-white/25">
          <TableRow className="border-b border-black/10 hover:bg-transparent">
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              onClick={() => onTicketClick(ticket.id)}
              className="
    cursor-pointer
    transition-colors
   hover:bg-[#F2A88D]/20
    focus-visible:bg-[#F2CFC2]/50
    focus-visible:outline-none
  "
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onTicketClick(ticket.id);
                }
              }}
            >
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>
                <TicketStatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell>{ticket.category.name}</TableCell>
              <TableCell>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
