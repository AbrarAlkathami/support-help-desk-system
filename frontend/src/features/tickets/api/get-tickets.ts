import { apiClient } from "@/lib/api/api-client";
import type { Ticket, TicketsResponse, TicketStatus , TicketPriority, TicketsQueryParams } from "@/features/tickets/types/ticket";

type TicketApiItem = {
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
  };
  
  type TicketsApiResponse = {
    items: TicketApiItem[];
    total: number;
    page: number;
    page_size: number;
  };
  
  export async function getTickets({
    page,
    pageSize,
    status,
    priority,
    categoryId,
    assignee,
    search,
    sortBy,
    sortOrder,
  }: TicketsQueryParams): Promise<TicketsResponse> {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
  
    status?.forEach((value) => {
      params.append("status", value);
    });
  
    priority?.forEach((value) => {
      params.append("priority", value);
    });
  
    if (categoryId) {
      params.set("category_id", categoryId);
    }
  
    if (assignee) {
      params.set("assignee", assignee);
    }
  
    if (search) {
      params.set("search", search);
    }
  
    if (sortBy) {
      params.set("sort_by", sortBy);
    }
  
    if (sortOrder) {
      params.set("sort_order", sortOrder);
    }
  
    const response = await apiClient<TicketsApiResponse>(
      `/tickets?${params.toString()}`,
    );
  
    return {
      items: response.items.map((ticket) => ({
        id: ticket.id,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        requester: ticket.requester,
        assignee: ticket.assignee,
        category: ticket.category,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
      })),
      total: response.total,
      page: response.page,
      pageSize: response.page_size,
    };
  }