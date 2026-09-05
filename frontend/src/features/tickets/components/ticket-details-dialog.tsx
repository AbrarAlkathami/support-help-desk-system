"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Message,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from "@/components/ui/message";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTicket } from "@/features/tickets/hooks/use-ticket";
import { useAddComment } from "@/features/tickets/hooks/use-add-comment";
import { TicketStatusProgress } from "@/features/tickets/components/ticket-status-progress";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { ApiError } from "@/components/shared/api-error";
interface TicketDetailsDialogProps {
  ticketId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function TicketDetailsDialog({
  ticketId,
  onOpenChange,
}: TicketDetailsDialogProps) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);

  const addCommentMutation = useAddComment(ticketId ?? "");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
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

  return (
    <Dialog open={!!ticketId} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {isLoading && (
          <div className="flex min-h-60 items-center justify-center">
            <Spinner className="size-6" />
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
                Ticket details and comment history
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

              <div>
                <p className="text-xs text-muted-foreground">Last updated</p>

                <p className="mt-1 text-sm">
                  {new Date(ticket.updatedAt).toLocaleString()}
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
              <h3 className="font-medium">Comments</h3>

              <div className="space-y-4">
                {ticket.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                ) : (
                  ticket.comments.map((comment) => (
                    <Message
                      key={comment.id}
                      align={
                        comment.authorId === ticket.requester.id
                          ? "end"
                          : "start"
                      }
                    >
                      <MessageContent>
                        <MessageHeader>{comment.author.name}</MessageHeader>

                        <Bubble>
                          <BubbleContent>{comment.body}</BubbleContent>
                        </Bubble>

                        <MessageFooter>
                          {new Date(comment.createdAt).toLocaleString()}
                        </MessageFooter>
                      </MessageContent>
                    </Message>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t pt-5">
              <label htmlFor="comment" className="text-sm font-medium">
                Add a comment
              </label>

              <Textarea
                id="comment"
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);

                  if (commentError) {
                    setCommentError("");
                  }
                }}
                placeholder="Write a comment..."
                className="mt-2"
                rows={4}
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
                  Add comment
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
