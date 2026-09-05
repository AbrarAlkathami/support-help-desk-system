import { apiClient } from "@/lib/api/api-client";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/features/tickets/types/ticket";

export type UpdateTicketData = {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string | null;
};

type UpdateTicketApiResponse = {
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

export async function updateTicket(
  ticketId: string,
  data: UpdateTicketData,
): Promise<Ticket> {
  const response = await apiClient<UpdateTicketApiResponse>(
    `/tickets/${ticketId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        ...(data.status !== undefined && {
          status: data.status,
        }),

        ...(data.priority !== undefined && {
          priority: data.priority,
        }),

        ...(data.assigneeId !== undefined && {
          assignee_id: data.assigneeId,
        }),
      }),
    },
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
    slaDueAt: response.sla_due_at,
    isOverdue: response.is_overdue,
  };
}