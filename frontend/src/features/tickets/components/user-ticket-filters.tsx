"use client";

import { X } from "lucide-react";

import type { TicketStatus } from "@/features/tickets/types/ticket";

import { Button } from "@/components/ui/button";
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
  onClearFilters: () => void;
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
  onClearFilters,
}: UserTicketFiltersProps) {
  const hasActiveFilters = search.trim().length > 0 || Boolean(status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search tickets..."
        className="w-full sm:w-[280px] lg:w-[320px]"
      />

      <Select
        items={userStatusOptions}
        value={status ?? "all"}
        onValueChange={(value) => {
          if (!value) return;

          onStatusChange(value === "all" ? undefined : (value as TicketStatus));
        }}
      >
        <SelectTrigger className="h-9 w-[160px] bg-background shadow-none">
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

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-1.5 px-2 text-muted-foreground"
          onClick={onClearFilters}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
