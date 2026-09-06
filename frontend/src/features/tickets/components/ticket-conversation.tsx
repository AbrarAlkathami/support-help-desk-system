"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

import { ApiError } from "@/components/shared/api-error";
import { UserIdentity } from "@/components/shared/user-identity";

import { useAddComment } from "@/features/tickets/hooks/use-add-comment";

interface TicketComment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: {
    name: string;
    email?: string | null;
  };
}

interface TicketConversationProps {
  ticketId: string;
  comments: TicketComment[];
  currentUserId?: string;
}

function formatCommentDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TicketConversation({
  ticketId,
  comments,
  currentUserId,
}: TicketConversationProps) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const addCommentMutation = useAddComment(ticketId);

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
          title: "Reply sent",
          description: "Your reply was added successfully.",
          type: "success",
        });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">Conversation</h3>

        <p className="mt-1 text-xs text-muted-foreground">
          {comments.length === 0
            ? "No replies yet."
            : `${comments.length} ${
                comments.length === 1 ? "reply" : "replies"
              }`}
        </p>
      </div>

      <div className="space-y-5">
        {comments.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No comments yet. Start the conversation below.
            </p>
          </div>
        ) : (
          comments.map((ticketComment) => {
            const isCurrentUser = ticketComment.authorId === currentUserId;

            return (
              <div
                key={ticketComment.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className="w-full max-w-[85%] space-y-2">
                  <div
                    className={`flex items-center gap-2 ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <UserIdentity
                      name={ticketComment.author.name}
                      email={ticketComment.author.email}
                    />

                    <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                      {formatCommentDate(ticketComment.createdAt)}
                    </span>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isCurrentUser
                        ? "ml-auto rounded-tr-sm bg-primary text-primary-foreground"
                        : "mr-auto rounded-tl-sm bg-muted/70 text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {ticketComment.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-3">
        <Textarea
          value={comment}
          rows={3}
          placeholder="Write a reply..."
          className="resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
          onChange={(event) => {
            setComment(event.target.value);

            if (commentError) {
              setCommentError("");
            }
          }}
        />

        {commentError && (
          <p className="mt-2 text-sm text-destructive">{commentError}</p>
        )}

        {addCommentMutation.isError && (
          <ApiError error={addCommentMutation.error} className="mt-2" />
        )}

        <div className="mt-3 flex justify-end border-t pt-3">
          <Button
            type="submit"
            size="sm"
            disabled={addCommentMutation.isPending}
            className="gap-2"
          >
            {addCommentMutation.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <Send className="size-4" />
            )}
            Reply
          </Button>
        </div>
      </form>
    </div>
  );
}
