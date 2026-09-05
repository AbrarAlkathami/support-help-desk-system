"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";

import { Bubble, BubbleContent } from "@/components/ui/bubble";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

import { ApiError } from "@/components/shared/api-error";

import { useTicket } from "../hooks/use-ticket";
import { useAddComment } from "../hooks/use-add-comment";
import { useUpdateTicket } from "../hooks/use-update-ticket";

import { useModerators } from "@/features/users/hooks/use-moderators";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { TicketStatusBadge } from "./ticket-status-badge";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketStatusProgress } from "./ticket-status-progress";

import {
  ticketPriorityOptions,
  ticketStatusOptions,
} from "../constants/ticket-filter-options";

import type { TicketPriority, TicketStatus } from "../types/ticket";

interface TicketManagementDialogProps {
  ticketId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function TicketManagementDialog({
  ticketId,
  onOpenChange,
}: TicketManagementDialogProps) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);

  const { data: currentUser } = useCurrentUser();

  const {
    data: moderators = [],
    isLoading: isModeratorsLoading,
    isError: isModeratorsError,
  } = useModerators();

  const updateTicketMutation = useUpdateTicket(ticketId ?? "");

  const addCommentMutation = useAddComment(ticketId ?? "");

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

  const handleAssignToMe = () => {
    if (!currentUser || !ticket) return;

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
            description: "The ticket was assigned to you successfully.",
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
            description: "The ticket status was updated successfully.",
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
            description: "The ticket priority was updated successfully.",
            type: "success",
          });
        },
      },
    );
  };

  const handleCommentSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = comment.trim();

    if (!body) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    setCommentError("");

    addCommentMutation.mutate(body, {
      onSuccess: () => {
        setComment("");

        toast.add({
          title: "Comment added",
          description: "Your comment was added successfully.",
          type: "success",
        });
      },
    });
  };

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

  return (
    <Dialog open={!!ticketId} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {isLoading && (
          <div className="flex min-h-72 items-center justify-center">
            <Spinner className="size-7" />
          </div>
        )}

        {isError && (
          <ApiError
            variant="alert"
            title="Could not load ticket"
            error={error}
          />
        )}

        {ticket && (
          <>
            <DialogHeader>
              <DialogTitle>{ticket.subject}</DialogTitle>

              <DialogDescription>
                Manage ticket details, assignment and conversation.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-2">
              <TicketStatusBadge status={ticket.status} />

              <TicketPriorityBadge priority={ticket.priority} />
            </div>

            <div className="py-4">
              <TicketStatusProgress status={ticket.status} />
            </div>

            <div className="grid gap-4 border-y py-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Requester</p>

                <p className="mt-1 text-sm font-medium">
                  {ticket.requester.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Category</p>

                <p className="mt-1 text-sm font-medium">
                  {ticket.category.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Assigned to</p>

                <p className="mt-1 text-sm font-medium">
                  {ticket.assignee?.name ?? "Unassigned"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Created</p>

                <p className="mt-1 text-sm">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Description</h3>

              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {ticket.description}
              </p>
            </div>

            <div className="border-t pt-5">
              <h3 className="font-medium">Ticket actions</h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignee</label>

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
                    <SelectTrigger className="w-full">
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

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={
                      !currentUser ||
                      ticket.assignee?.id === currentUser.id ||
                      updateTicketMutation.isPending
                    }
                    onClick={handleAssignToMe}
                  >
                    Assign to me
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>

                  <Select
                    items={ticketStatusOptions}
                    value={ticket.status}
                    disabled={updateTicketMutation.isPending}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>

                  <Select
                    items={ticketPriorityOptions}
                    value={ticket.priority}
                    disabled={updateTicketMutation.isPending}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger className="w-full">
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
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner className="size-4" />
                </div>
              )}

              {updateTicketMutation.isError && (
                <ApiError error={updateTicketMutation.error} className="mt-3" />
              )}

              {isModeratorsError && (
                <ApiError
                  fallback="Could not load moderators."
                  className="mt-3"
                />
              )}
            </div>

            <div className="border-t pt-5">
              <h3 className="font-medium">Comments</h3>

              <div className="mt-4 space-y-4">
                {ticket.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                ) : (
                  ticket.comments.map((ticketComment) => (
                    <Message
                      key={ticketComment.id}
                      align={
                        ticketComment.authorId === currentUser?.id
                          ? "end"
                          : "start"
                      }
                    >
                      <MessageContent>
                        <MessageHeader>
                          {ticketComment.author.name}
                        </MessageHeader>

                        <Bubble>
                          <BubbleContent>{ticketComment.body}</BubbleContent>
                        </Bubble>

                        <MessageFooter>
                          {new Date(ticketComment.createdAt).toLocaleString()}
                        </MessageFooter>
                      </MessageContent>
                    </Message>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleCommentSubmit} className="border-t pt-5">
              <label
                htmlFor="management-comment"
                className="text-sm font-medium"
              >
                Reply
              </label>

              <Textarea
                id="management-comment"
                value={comment}
                rows={4}
                placeholder="Write a reply..."
                className="mt-2"
                onChange={(event) => {
                  setComment(event.target.value);

                  if (commentError) {
                    setCommentError("");
                  }
                }}
              />

              {commentError && (
                <p className="mt-1 text-sm text-destructive">{commentError}</p>
              )}

              {addCommentMutation.isError && (
                <ApiError error={addCommentMutation.error} className="mt-2" />
              )}

              <div className="mt-3 flex justify-end">
                <Button type="submit" disabled={addCommentMutation.isPending}>
                  {addCommentMutation.isPending && (
                    <Spinner className="size-4" />
                  )}
                  Reply
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
