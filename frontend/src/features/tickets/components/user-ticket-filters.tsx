import type { TicketStatus } from "@/features/tickets/types/ticket";

import { SearchInput } from "@/components/shared/search-input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ticketStatusOptions } from "@/features/tickets/constants/ticket-filter-options";

interface UserTicketFiltersProps {
  search: string;
  status?: TicketStatus;

  onSearchChange: (value: string) => void;
  onStatusChange: (value?: TicketStatus) => void;
}

const userStatusOptions = [
  {
    label: "All statuses",
    value: "all",
  },
  ...ticketStatusOptions,
];

export function UserTicketFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: UserTicketFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search tickets..."
        className="w-full lg:max-w-sm"
      />

      <Select
        items={userStatusOptions}
        value={status ?? "all"}
        onValueChange={(value) => {
          if (!value) return;

          onStatusChange(value === "all" ? undefined : (value as TicketStatus));
        }}
      >
        <SelectTrigger className="w-170px">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          {userStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
