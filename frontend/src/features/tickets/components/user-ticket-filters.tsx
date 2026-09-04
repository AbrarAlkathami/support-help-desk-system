import type { TicketStatus } from "@/features/tickets/types/ticket";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserTicketFiltersProps {
  search: string;
  status?: TicketStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value?: TicketStatus) => void;
}

export function UserTicketFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: UserTicketFiltersProps) {
  const statusLabels: Record<TicketStatus, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search tickets..."
        className=" w-full rounded-none border-0 border-b border-b-muted-foreground/40 bg-transparent text-foreground shadow-none transition-colors placeholder:text-muted-foreground hover:border-b-primary focus-visible:border-b-primary focus-visible:ring-0 sm:max-w-md"
      />

      <Select
        value={status ?? "all"}
        onValueChange={(value) =>
          onStatusChange(value === "all" ? undefined : (value as TicketStatus))
        }
      >
        <SelectTrigger
          className="
            w-full
    rounded-lg
    border
    border-border
    bg-white
    shadow-none
    hover:border-primary
    focus-visible:border-primary
    focus-visible:ring-0
    sm:w-48
  "
        >
          <SelectValue placeholder="All statuses">
            {(value) => {
              if (!value || value === "all") {
                return "All statuses";
              }

              return statusLabels[value as TicketStatus];
            }}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="border-border bg-white">
          <SelectItem
            value="all"
            className="bg-white data-highlighted:bg-primary/10 data-selected:bg-primary/10"
          >
            All statuses
          </SelectItem>
          <SelectItem
            value="open"
            className="bg-transparent data-highlighted:bg-primary/10 data-selected:bg-primary/10"
          >
            Open
          </SelectItem>
          <SelectItem
            value="in_progress"
            className="bg-transparent data-highlighted:bg-primary/10 data-selected:bg-primary/10"
          >
            In Progress
          </SelectItem>
          <SelectItem
            value="resolved"
            className="bg-transparent data-highlighted:bg-primary/10 data-selected:bg-primary/10"
          >
            Resolved
          </SelectItem>
          <SelectItem
            value="closed"
            className="bg-transparent data-highlighted:bg-primary/10 data-selected:bg-primary/10"
          >
            Closed
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
