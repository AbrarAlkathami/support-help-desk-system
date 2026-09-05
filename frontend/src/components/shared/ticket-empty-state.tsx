import { TicketIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface TicketEmptyStateProps {
  hasActiveFilters: boolean;
  emptyTitle?: string;
  emptyDescription: string;
}

export function TicketEmptyState({
  hasActiveFilters,
  emptyTitle = "No tickets yet",
  emptyDescription,
}: TicketEmptyStateProps) {
  return (
    <Empty className="mt-4 border bg-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TicketIcon />
        </EmptyMedia>

        <EmptyTitle>
          {hasActiveFilters ? "No tickets found" : emptyTitle}
        </EmptyTitle>

        <EmptyDescription>
          {hasActiveFilters
            ? "No tickets match your current search or filters."
            : emptyDescription}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
