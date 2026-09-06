"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

import { ApiError } from "@/components/shared/api-error";
import { UserIdentity } from "@/components/shared/user-identity";

import { useTicket } from "@/features/tickets/hooks/use-ticket";
import { useUpdateTicket } from "@/features/tickets/hooks/use-update-ticket";

import { useModerators } from "@/features/users/hooks/use-moderators";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { TicketStatusProgress } from "@/features/tickets/components/ticket-status-progress";
import { TicketConversation } from "@/features/tickets/components/ticket-conversation";

import {
  ticketPriorityOptions,
  ticketStatusOptions,
} from "@/features/tickets/constants/ticket-filter-options";
import { useDeleteTicket } from "@/features/tickets/hooks/use-delete-ticket";
import type {
  TicketPriority,
  TicketStatus,
} from "@/features/tickets/types/ticket";

interface TicketManagementDialogProps {
  ticketId: string | null;
  onOpenChange: (open: boolean) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TicketManagementDialog({
  ticketId,
  onOpenChange,
}: TicketManagementDialogProps) {
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);

  const { data: currentUser } = useCurrentUser();

  const {
    data: moderators = [],
    isLoading: isModeratorsLoading,
    isError: isModeratorsError,
  } = useModerators();

  const updateTicketMutation = useUpdateTicket(ticketId ?? "");
  const deleteTicketMutation = useDeleteTicket();
  const moderatorOptions = [
    {
      label: "Unassigned",
      value: "unassigned",
    },

    ...moderators.map((moderator) => ({
      label: moderator.name,
      value: moderator.id,
    })),
  ];

  const handleAssign = (value: string | null) => {
    if (!value || !ticket) return;

    const assigneeId = value === "unassigned" ? null : value;

    if (
      ticket.assignee?.id === assigneeId ||
      (!ticket.assignee && assigneeId === null)
    ) {
      return;
    }

    updateTicketMutation.mutate(
      {
        assigneeId,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Assignment updated",
            description:
              assigneeId === null
                ? "The ticket is now unassigned."
                : "The ticket assignee was updated successfully.",
            type: "success",
          });
        },
      },
    );
  };

  const handleCloseTicket = () => {
    if (
      !ticket ||
      currentUser?.role !== "admin" ||
      ticket.status === "closed"
    ) {
      return;
    }

    deleteTicketMutation.mutate(ticket.id, {
      onSuccess: () => {
        toast.add({
          title: "Ticket closed",
          description: "The ticket was closed successfully.",
          type: "success",
        });

        onOpenChange(false);
      },
    });
  };

  const handleAssignToMe = () => {
    if (!currentUser || !ticket) return;

    if (currentUser.role !== "moderator") return;

    if (ticket.assignee?.id === currentUser.id) {
      return;
    }

    updateTicketMutation.mutate(
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

  const handleStatusChange = (value: string | null) => {
    if (!value || !ticket) return;

    const status = value as TicketStatus;

    if (status === ticket.status) return;

    updateTicketMutation.mutate(
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

  const handlePriorityChange = (value: string | null) => {
    if (!value || !ticket) return;

    const priority = value as TicketPriority;

    if (priority === ticket.priority) return;

    updateTicketMutation.mutate(
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
    <Sheet open={Boolean(ticketId)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="
          top-4
          right-4
          bottom-4
          h-auto
          overflow-hidden
          rounded-3xl
          border
          bg-background
          p-0
          shadow-2xl
        "
        style={{
          width: "min(760px, calc(100vw - 2rem))",
          maxWidth: "none",
        }}
      >
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <Spinner className="size-7" />
          </div>
        )}

        {isError && (
          <div className="p-7">
            <ApiError
              variant="alert"
              title="Could not load ticket"
              error={error}
            />
          </div>
        )}

        {ticket && (
          <div className="h-full overflow-y-auto divide-y">
            {/* Header */}
            <section className="px-7 py-5">
              <SheetHeader className="!gap-1 !p-0 text-left">
                <SheetTitle className="pr-10 text-xl font-semibold leading-7">
                  {ticket.subject}
                </SheetTitle>

                <SheetDescription className="text-xs">
                  {ticket.id}
                </SheetDescription>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <TicketStatusBadge status={ticket.status} />

                  <TicketPriorityBadge priority={ticket.priority} />

                  <span className="text-xs text-muted-foreground">
                    {ticket.category.name}
                  </span>
                </div>
              </SheetHeader>
            </section>

            {/* Progress */}
            <section className="px-7 py-5">
              <TicketStatusProgress status={ticket.status} />
            </section>

            {/* Ticket information */}
            <section className="px-8 py-5">
              <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Requester
                  </p>

                  <div className="mt-2">
                    <UserIdentity name={ticket.requester.name} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Assigned to
                  </p>

                  <div className="mt-2">
                    {ticket.assignee ? (
                      <UserIdentity name={ticket.assignee.name} />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Category
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {ticket.category.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Created
                  </p>

                  <p className="mt-2 text-sm">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="px-8 py-5">
              <h3 className="text-sm font-semibold">Description</h3>

              <div className="mt-1 rounded-xl bg-muted/40 px-4 py-1">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {ticket.description}
                </p>
              </div>
            </section>

            {/* Ticket actions */}
            <section className="px-8 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Ticket actions</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Update assignment, status, or priority.
                  </p>
                </div>

                {currentUser?.role === "moderator" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      ticket.assignee?.id === currentUser.id ||
                      updateTicketMutation.isPending
                    }
                    onClick={handleAssignToMe}
                  >
                    Assign to me
                  </Button>
                )}
                {currentUser?.role === "admin" && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={
                      ticket.status === "closed" ||
                      deleteTicketMutation.isPending
                    }
                    onClick={handleCloseTicket}
                  >
                    {deleteTicketMutation.isPending && (
                      <Spinner className="size-4" />
                    )}

                    {ticket.status === "closed"
                      ? "Ticket closed"
                      : "Close ticket"}
                  </Button>
                )}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Assignee
                  </label>

                  <Select
                    items={moderatorOptions}
                    value={ticket.assignee?.id ?? "unassigned"}
                    disabled={
                      isModeratorsLoading ||
                      isModeratorsError ||
                      updateTicketMutation.isPending
                    }
                    onValueChange={handleAssign}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue
                        placeholder={
                          isModeratorsError ? "Unavailable" : "Assignee"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {moderatorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Status
                  </label>

                  <Select
                    items={ticketStatusOptions}
                    value={ticket.status}
                    disabled={updateTicketMutation.isPending}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {ticketStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Priority
                  </label>

                  <Select
                    items={ticketPriorityOptions}
                    value={ticket.priority}
                    disabled={updateTicketMutation.isPending}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {ticketPriorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {updateTicketMutation.isPending && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Spinner className="size-4" />
                  Updating ticket...
                </div>
              )}

              {updateTicketMutation.isError && (
                <ApiError error={updateTicketMutation.error} className="mt-3" />
              )}
              {deleteTicketMutation.isError && (
                <ApiError error={deleteTicketMutation.error} className="mt-3" />
              )}

              {isModeratorsError && (
                <ApiError
                  fallback="Could not load moderators."
                  className="mt-3"
                />
              )}
            </section>

            {/* Conversation */}
            <section className="px-8 py-5">
              <TicketConversation
                ticketId={ticket.id}
                comments={ticket.comments}
                currentUserId={currentUser?.id}
              />
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
