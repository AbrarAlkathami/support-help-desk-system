"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";

import { ArrowUpIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Bubble, BubbleContent } from "@/components/ui/bubble";

import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";

import { ApiError } from "@/components/shared/api-error";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateSeparator(date: string) {
  const commentDate = new Date(date);
  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const startOfComment = new Date(
    commentDate.getFullYear(),
    commentDate.getMonth(),
    commentDate.getDate(),
  );

  const differenceInDays = Math.round(
    (startOfToday.getTime() - startOfComment.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays === 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "Yesterday";
  }

  if (differenceInDays <= 6) {
    return commentDate.toLocaleDateString(undefined, {
      weekday: "long",
    });
  }

  if (commentDate.getFullYear() === today.getFullYear()) {
    return commentDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  return commentDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDateKey(date: string) {
  const value = new Date(date);

  return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
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

  let previousDateKey: string | null = null;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">Comments</h3>

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
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No comments yet. Start the conversation below.
            </p>
          </div>
        ) : (
          comments.map((ticketComment) => {
            const isCurrentUser = ticketComment.authorId === currentUserId;

            const dateKey = getDateKey(ticketComment.createdAt);

            const showDateSeparator = dateKey !== previousDateKey;

            previousDateKey = dateKey;

            return (
              <div key={ticketComment.id} className="space-y-4">
                {showDateSeparator && (
                  <div className="flex items-center justify-center py-2">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {formatDateSeparator(ticketComment.createdAt)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex items-start gap-2 ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isCurrentUser && (
                    <Avatar className="mt-5 size-7">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(ticketComment.author.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <Message align={isCurrentUser ? "end" : undefined}>
                    <MessageContent>
                      <MessageHeader>{ticketComment.author.name}</MessageHeader>

                      <Bubble variant={isCurrentUser ? undefined : "muted"}>
                        <BubbleContent>
                          <p className="whitespace-pre-wrap break-words">
                            {ticketComment.body}
                          </p>
                        </BubbleContent>
                      </Bubble>

                      <MessageFooter>
                        {formatTime(ticketComment.createdAt)}
                      </MessageFooter>
                    </MessageContent>
                  </Message>

                  {isCurrentUser && (
                    <Avatar className="mt-5 size-7">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(ticketComment.author.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <InputGroup className="rounded-xl">
          <Textarea
            value={comment}
            rows={1}
            placeholder="Write a reply..."
            className="min-h-[44px] max-h-24 resize-none border-0 bg-transparent px-3 py-2.5 shadow-none focus-visible:ring-0"
            onChange={(event) => {
              setComment(event.target.value);

              if (commentError) {
                setCommentError("");
              }
            }}
          />

          <InputGroupAddon align="block-end" className="px-2 pb-1.5">
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={!comment.trim() || addCommentMutation.isPending}
              className="ml-auto rounded-full"
              aria-label="Send reply"
            >
              {addCommentMutation.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}

              <span className="sr-only">Send reply</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {commentError && (
          <p className="mt-2 text-sm text-destructive">{commentError}</p>
        )}

        {addCommentMutation.isError && (
          <ApiError error={addCommentMutation.error} className="mt-2" />
        )}
      </form>
    </div>
  );
}
