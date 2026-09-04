import { apiClient } from "@/lib/api/api-client";

import type {
  TicketDetails,
  TicketPriority,
  TicketStatus,
} from "@/features/tickets/types/ticket";

type TicketDetailsApiResponse = {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;

  requester: {
    id: string;
    name: string;
  };

  assignee: {
    id: string;
    name: string;
  } | null;

  category: {
    id: string;
    name: string;
  };

  created_at: string;
  updated_at: string;

  comments: {
    id: string;
    ticket_id: string;
    author_id: string;
    body: string;
    created_at: string;

    author: {
      id: string;
      name: string;
    };
  }[];
};

export async function getTicket(
  ticketId: string,
): Promise<TicketDetails> {
  const response = await apiClient<TicketDetailsApiResponse>(
    `/tickets/${ticketId}`,
  );

  return {
    id: response.id,
    subject: response.subject,
    description: response.description,
    status: response.status,
    priority: response.priority,
    requester: response.requester,
    assignee: response.assignee,
    category: response.category,
    createdAt: response.created_at,
    updatedAt: response.updated_at,

    comments: response.comments.map((comment) => ({
      id: comment.id,
      ticketId: comment.ticket_id,
      authorId: comment.author_id,
      body: comment.body,
      createdAt: comment.created_at,
      author: comment.author,
    })),
  };
}