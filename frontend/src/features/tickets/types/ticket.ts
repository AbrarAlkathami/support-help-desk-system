export type TicketStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";


  type TicketUser = {
    id: string;
    name: string;
  };
  
  type TicketCategory = {
    id: string;
    name: string;
  };
  
  export type Ticket = {
    id: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
  
    requester: TicketUser;
    assignee: TicketUser | null;
    category: TicketCategory;
  
    createdAt: string;
    updatedAt: string;
  
    slaDueAt: string;
    isOverdue: boolean;
  };

  export type TicketsResponse = {
    items: Ticket[];
    total: number;
    page: number;
    pageSize: number;
  };

  export type TicketSortBy = "created_at" | "priority";
  export type SortOrder = "asc" | "desc";
  
  export type TicketsQueryParams = {
    page: number;
    pageSize: number;
  
    status?: TicketStatus[];
    priority?: TicketPriority[];
  
    categoryId?: string;
    assignee?: string;
  
    search?: string;
  
    sortBy?: TicketSortBy;
    sortOrder?: SortOrder;
  };


  export type TicketComment = {
    id: string;
    ticketId: string;
    authorId: string;
    body: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
    };
  };
  
  export type TicketDetails = Ticket & {
    comments: TicketComment[];
  };