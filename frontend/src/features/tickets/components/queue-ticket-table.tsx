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
import { UserIdentity } from "@/components/shared/user-identity";
import { CircleDashed } from "lucide-react";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { TicketAssigneeBadge } from "@/features/tickets/components/ticket-assignee-badge";
import { TicketRowActions } from "@/features/tickets/components/ticket-row-actions";
import { TicketSla } from "@/features/tickets/components/ticket-sla";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUpdateTicket } from "@/features/tickets/hooks/use-update-ticket";
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

function TicketAssigneeCell({ ticket }: { ticket: Ticket }) {
  const { data: currentUser } = useCurrentUser();
  const mutation = useUpdateTicket(ticket.id);

  if (ticket.assignee) {
    return <TicketAssigneeBadge assignee={ticket.assignee} />;
  }

  if (currentUser?.role !== "moderator") {
    return <TicketAssigneeBadge assignee={null} />;
  }

  const handleAssignToMe = () => {
    mutation.mutate(
      {
        assigneeId: currentUser.id,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Ticket assigned",
            description: "The ticket was assigned to you.",
            type: "success",
          });
        },
      },
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 rounded-full border border-dashed border-muted-foreground/30 bg-transparent px-3 text-xs font-medium text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
      disabled={mutation.isPending}
      onClick={(event) => {
        event.stopPropagation();
        handleAssignToMe();
      }}
    >
      {mutation.isPending ? (
        <Spinner className="size-3.5" />
      ) : (
        <CircleDashed className="size-4" />
      )}
      Assign to me
    </Button>
  );
}

export function QueueTicketTable({
  tickets,
  onTicketClick,
}: QueueTicketTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table className="w-full table-fixed">
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[20%] px-4">Ticket</TableHead>
            <TableHead className="w-[14%] px-3">Requester</TableHead>
            <TableHead className="w-[8%] px-3">Status</TableHead>
            <TableHead className="w-[8%] px-3">Priority</TableHead>
            <TableHead className="w-[11%] px-3">Category</TableHead>
            <TableHead className="w-[13%] px-3">Assignee</TableHead>
            <TableHead className="w-[10%] px-3">Created</TableHead>
            <TableHead className="w-[11%] px-3">SLA</TableHead>
            <TableHead className="w-[5%] px-3">
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
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="min-w-0 cursor-default">
                      <p className="truncate text-sm font-semibold text-foreground">
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

              <TableCell className="px-4 py-4 align-middle">
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="min-w-0">
                      <UserIdentity name={ticket.requester.name} />
                    </div>
                  </HoverCardTrigger>

                  <HoverCardContent
                    side="top"
                    className="w-auto max-w-[240px] px-3 py-2"
                  >
                    <UserIdentity name={ticket.requester.name} />
                  </HoverCardContent>
                </HoverCard>
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <TicketStatusBadge status={ticket.status} />
              </TableCell>

              <TableCell className="px-4 py-4 align-middle">
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>

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

              <TableCell className="px-4 py-4 align-middle">
                {ticket.assignee ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="min-w-0">
                        <TicketAssigneeBadge assignee={ticket.assignee} />
                      </div>
                    </HoverCardTrigger>

                    <HoverCardContent
                      side="top"
                      className="w-auto max-w-[240px] px-3 py-2"
                    >
                      <UserIdentity name={ticket.assignee.name} />
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <TicketAssigneeCell ticket={ticket} />
                )}
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
