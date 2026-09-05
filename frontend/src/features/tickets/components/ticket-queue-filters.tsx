"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SearchInput } from "@/components/shared/search-input";

import {
  ticketAssigneeOptions,
  ticketPriorityOptions,
  ticketSortOptions,
  ticketStatusOptions,
} from "@/features/tickets/constants/ticket-filter-options";

import type {
  SortOrder,
  TicketPriority,
  TicketSortBy,
  TicketStatus,
} from "@/features/tickets/types/ticket";

interface TicketQueueFiltersProps {
  search: string;

  onSearchChange: (value: string) => void;

  status: TicketStatus[];

  priority: TicketPriority[];

  categoryId?: string;

  categories: {
    id: string;
    name: string;
  }[];

  isCategoriesLoading: boolean;

  isCategoriesError: boolean;

  moderators: {
    id: string;
    name: string;
  }[];

  isModeratorsLoading: boolean;

  isModeratorsError: boolean;

  assignee?: string;

  sortBy: TicketSortBy;

  sortOrder: SortOrder;

  onStatusToggle: (value: TicketStatus) => void;

  onPriorityToggle: (value: TicketPriority) => void;

  onCategoryChange: (value: string | null) => void;

  onAssigneeChange: (value: string | null) => void;

  onSortChange: (sortBy: TicketSortBy, sortOrder: SortOrder) => void;

  onClearFilters: () => void;
}

export function TicketQueueFilters({
  search,
  onSearchChange,
  status,
  priority,
  categoryId,
  categories,
  isCategoriesLoading,
  isCategoriesError,
  moderators,
  isModeratorsLoading,
  isModeratorsError,
  assignee,
  sortBy,
  sortOrder,
  onStatusToggle,
  onPriorityToggle,
  onCategoryChange,
  onAssigneeChange,
  onSortChange,
  onClearFilters,
}: TicketQueueFiltersProps) {
  const categoryOptions = [
    {
      label: "All categories",
      value: "all",
    },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  const assigneeOptions = [
    ...ticketAssigneeOptions,
    ...moderators.map((moderator) => ({
      label: moderator.name,
      value: moderator.id,
    })),
  ];

  const hasActiveFilters =
    search.trim().length > 0 ||
    status.length > 0 ||
    priority.length > 0 ||
    Boolean(categoryId) ||
    Boolean(assignee);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search tickets..."
        className="w-full sm:w-[280px] lg:w-[320px]"
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="h-9 justify-between bg-background shadow-none"
            />
          }
        >
          {status.length ? `Status (${status.length})` : "Status"}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-48">
          {ticketStatusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={status.includes(option.value)}
              onCheckedChange={() => onStatusToggle(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="h-9 justify-between bg-background shadow-none"
            />
          }
        >
          {priority.length ? `Priority (${priority.length})` : "Priority"}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-48">
          {ticketPriorityOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={priority.includes(option.value)}
              onCheckedChange={() => onPriorityToggle(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        items={categoryOptions}
        value={categoryId ?? "all"}
        disabled={isCategoriesLoading || isCategoriesError}
        onValueChange={(value) => {
          if (!value) return;

          onCategoryChange(value === "all" ? null : value);
        }}
      >
        <SelectTrigger className="h-9 w-[180px] bg-background shadow-none">
          <SelectValue
            placeholder={
              isCategoriesError ? "Categories unavailable" : "Category"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {categoryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={assigneeOptions}
        value={assignee ?? "all"}
        disabled={isModeratorsLoading || isModeratorsError}
        onValueChange={(value) => {
          if (!value) return;

          onAssigneeChange(value === "all" ? null : value);
        }}
      >
        <SelectTrigger className="h-9 w-[180px] bg-background shadow-none">
          <SelectValue
            placeholder={
              isModeratorsError ? "Assignees unavailable" : "Assignee"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {assigneeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={ticketSortOptions}
        value={`${sortBy}-${sortOrder}`}
        onValueChange={(value) => {
          if (!value) return;

          const [newSortBy, newSortOrder] = value.split("-");

          if (
            (newSortBy === "created_at" || newSortBy === "priority") &&
            (newSortOrder === "asc" || newSortOrder === "desc")
          ) {
            onSortChange(newSortBy, newSortOrder);
          }
        }}
      >
        <SelectTrigger className="h-9 w-[190px] bg-background shadow-none">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>

        <SelectContent>
          {ticketSortOptions.map((option) => (
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
          size="icon"
          className="size-9 text-muted-foreground"
          onClick={onClearFilters}
          aria-label="Clear filters"
          title="Clear filters"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
