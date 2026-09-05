// features/tickets/api/create-ticket.ts

import { apiClient } from "@/lib/api/api-client";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/features/tickets/types/ticket";

import type { CreateTicketFormValues } from "@/features/tickets/schemas/create-ticket-schema";

type CreateTicketApiResponse = {
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
  sla_due_at: string;
is_overdue: boolean;
};

export async function createTicket(
  data: CreateTicketFormValues,
): Promise<Ticket> {
  const response =
    await apiClient<CreateTicketApiResponse>("/tickets", {
      method: "POST",
      body: JSON.stringify({
        subject: data.subject,
        description: data.description,
        category_id: data.categoryId,
      }),
    });

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
    slaDueAt: response.sla_due_at,
    isOverdue: response.is_overdue,
  };
}