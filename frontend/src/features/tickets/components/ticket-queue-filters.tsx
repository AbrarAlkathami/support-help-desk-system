"use client";

import { ArrowUpDown, ChevronDown, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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

  const selectedCategoryLabel =
    categoryOptions.find((option) => option.value === (categoryId ?? "all"))
      ?.label ?? "All categories";

  const selectedAssigneeLabel =
    assigneeOptions.find((option) => option.value === (assignee ?? "all"))
      ?.label ?? "All assignees";

  const selectedSortValue = `${sortBy}-${sortOrder}`;

  const selectedSortLabel =
    ticketSortOptions.find((option) => option.value === selectedSortValue)
      ?.label ?? "Newest first";

  const filterTriggerClass =
    "h-9 shrink-0 justify-between rounded-none border-0  bg-background px-3 font-normal shadow-none hover:bg-background focus-visible:border-foreground/40 focus-visible:ring-0 whitespace-nowrap";
  return (
    <div className="flex items-center gap-4">
      {" "}
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search tickets..."
        className="w-[260px] shrink-0"
      />
      {/* Status */}
      <div className="ml-auto flex items-center gap-2 overflow-x-auto">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className={`${filterTriggerClass} min-w-[120px]`}
              />
            }
          >
            <span>
              {status.length ? `Status · ${status.length}` : "Status"}
            </span>

            <ChevronDown className="size-4 text-muted-foreground" />
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
        {/* Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className={`${filterTriggerClass} min-w-[120px]`}
              />
            }
          >
            <span>
              {priority.length ? `Priority · ${priority.length}` : "Priority"}
            </span>

            <ChevronDown className="size-4 text-muted-foreground" />
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
        {/* Category */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                disabled={isCategoriesLoading || isCategoriesError}
                className={`${filterTriggerClass} min-w-[170px]`}
              />
            }
          >
            <span>{selectedCategoryLabel}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[210px]">
            {categoryOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() =>
                  onCategoryChange(option.value === "all" ? null : option.value)
                }
              >
                <span className="flex-1">{option.label}</span>

                {(categoryId ?? "all") === option.value && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Assignee */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                disabled={isModeratorsLoading || isModeratorsError}
                className={`${filterTriggerClass} min-w-[170px]`}
              />
            }
          >
            <span className="truncate">{selectedAssigneeLabel}</span>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[210px]">
            {assigneeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() =>
                  onAssigneeChange(option.value === "all" ? null : option.value)
                }
              >
                <span className="flex-1">{option.label}</span>

                {(assignee ?? "all") === option.value && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className={`${filterTriggerClass} min-w-[200px]`}
              />
            }
          >
            <div className="flex min-w-0 items-center gap-2">
              <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" />
              <span>{selectedSortLabel}</span>
            </div>

            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[230px]">
            {ticketSortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => {
                  const [newSortBy, newSortOrder] = option.value.split("-");

                  if (
                    (newSortBy === "created_at" || newSortBy === "priority") &&
                    (newSortOrder === "asc" || newSortOrder === "desc")
                  ) {
                    onSortChange(newSortBy, newSortOrder);
                  }
                }}
              >
                <span className="flex-1">{option.label}</span>

                {selectedSortValue === option.value && (
                  <Check className="size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
    </div>
  );
}
