"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ApiError } from "@/components/shared/api-error";

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
      { status },
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
      { priority },
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
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Ticket actions" />
          }
        >
          {mutation.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <MoreHorizontal className="size-4" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ticket actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={onOpen}>Open ticket</DropdownMenuItem>

            <DropdownMenuItem
              disabled={!currentUser || ticket.assignee?.id === currentUser.id}
              onClick={handleAssignToMe}
            >
              Assign to me
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>

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
            <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>

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
        </DropdownMenuContent>
      </DropdownMenu>

      {mutation.isError && <ApiError error={mutation.error} className="mt-1" />}
    </div>
  );
}
