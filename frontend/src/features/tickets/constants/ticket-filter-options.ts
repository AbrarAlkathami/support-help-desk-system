import type {
    TicketPriority,
    TicketStatus,
  } from "@/features/tickets/types/ticket";
  
  export const ticketStatusOptions: {
    label: string;
    value: TicketStatus;
  }[] = [
    { label: "Open", value: "open" },
    { label: "In progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];
  
  export const ticketPriorityOptions: {
    label: string;
    value: TicketPriority;
  }[] = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];
  
  export const ticketSortOptions = [
    {
      label: "Newest first",
      value: "created_at-desc",
    },
    {
      label: "Oldest first",
      value: "created_at-asc",
    },
    {
      label: "Priority high → low",
      value: "priority-desc",
    },
    {
      label: "Priority low → high",
      value: "priority-asc",
    },
  ];
  
  export const ticketAssigneeOptions = [
    {
      label: "All assignees",
      value: "all",
    },
    {
      label: "Assigned to me",
      value: "me",
    },
    {
      label: "Unassigned",
      value: "unassigned",
    },
  ];
  