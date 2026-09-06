"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Spinner } from "@/components/ui/spinner";

import { ApiError } from "@/components/shared/api-error";
import { UserIdentity } from "@/components/shared/user-identity";

import { useTicket } from "@/features/tickets/hooks/use-ticket";

import { TicketStatusProgress } from "@/features/tickets/components/ticket-status-progress";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { TicketConversation } from "@/features/tickets/components/ticket-conversation";

interface TicketDetailsDialogProps {
  ticketId: string | null;
  onOpenChange: (open: boolean) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TicketDetailsDialog({
  ticketId,
  onOpenChange,
}: TicketDetailsDialogProps) {
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);

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
            <Spinner className="size-6" />
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
          <div className="h-full divide-y overflow-y-auto">
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

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Last updated
                  </p>

                  <p className="mt-2 text-sm">{formatDate(ticket.updatedAt)}</p>
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

            {/* Conversation */}
            <section className="px-8 py-5">
              <TicketConversation
                ticketId={ticket.id}
                comments={ticket.comments}
                currentUserId={ticket.requester.id}
              />
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
