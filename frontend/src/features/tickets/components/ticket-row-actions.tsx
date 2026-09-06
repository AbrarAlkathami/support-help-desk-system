"use client";

import { toast } from "@/components/ui/toast";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { ApiError } from "@/components/shared/api-error";
import { DataTableActions } from "@/components/shared/data-table-actions";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useUpdateTicket } from "@/features/tickets/hooks/use-update-ticket";

import {
  ticketPriorityOptions,
  ticketStatusOptions,
} from "@/features/tickets/constants/ticket-filter-options";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/features/tickets/types/ticket";

interface TicketRowActionsProps {
  ticket: Ticket;
  onOpen: () => void;
}

export function TicketRowActions({ ticket, onOpen }: TicketRowActionsProps) {
  const { data: currentUser } = useCurrentUser();

  const mutation = useUpdateTicket(ticket.id);

  const handleAssignToMe = () => {
    if (!currentUser) return;

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

  const handleStatus = (status: TicketStatus) => {
    mutation.mutate(
      {
        status,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Status updated",
            description: "Ticket status was updated.",
            type: "success",
          });
        },
      },
    );
  };

  const handlePriority = (priority: TicketPriority) => {
    mutation.mutate(
      {
        priority,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Priority updated",
            description: "Ticket priority was updated.",
            type: "success",
          });
        },
      },
    );
  };

  return (
    <>
      <DataTableActions isPending={mutation.isPending} label="Ticket actions">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ticket actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={onOpen}>View details</DropdownMenuItem>

          {currentUser?.role === "moderator" && (
            <DropdownMenuItem
              disabled={ticket.assignee?.id === currentUser.id}
              onClick={handleAssignToMe}
            >
              Assign to me
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              {ticketStatusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  disabled={ticket.status === option.value}
                  onClick={() => handleStatus(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change priority</DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              {ticketPriorityOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  disabled={ticket.priority === option.value}
                  onClick={() => handlePriority(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DataTableActions>

      {mutation.isError && <ApiError error={mutation.error} className="mt-1" />}
    </>
  );
}
