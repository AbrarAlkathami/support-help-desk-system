import { apiClient } from "@/lib/api/api-client";

export type AddCommentData = {
  ticketId: string;
  body: string;
};

export function addComment({
  ticketId,
  body,
}: AddCommentData) {
  return apiClient(`/tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify({
      body,
    }),
  });
}