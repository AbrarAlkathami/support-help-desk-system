"use client";
import { useState } from "react";

import { AppPagination } from "@/components/shared/app-pagination";
import { useTickets } from "../hooks/use-tickets";
import { useTicketQueueParams } from "../hooks/use-ticket-queue-params";
import { Spinner } from "@/components/ui/spinner";
import { QueueTicketTable } from "./queue-ticket-table";
import { TicketQueueFilters } from "@/features/tickets/components/ticket-queue-filters";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { TicketEmptyState } from "@/components/shared/ticket-empty-state";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { ApiError } from "@/components/shared/api-error";
import { TicketManagementDialog } from "@/features/tickets/components/ticket-management-dialog";
import { useModerators } from "@/features/users/hooks/use-moderators";

export function TicketQueue() {
  const {
    page,
    pageSize,
    search,
    searchValue,
    setSearchValue,
    status,
    priority,
    categoryId,
    assignee,
    sortBy,
    sortOrder,
    toggleStatus,
    togglePriority,
    updateParams,
  } = useTicketQueueParams();
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();

  const { data, isLoading, isError, isFetching, error } = useTickets({
    page,
    pageSize,
    status: status.length ? status : undefined,
    priority: priority.length ? priority : undefined,
    categoryId,
    assignee,
    search: search || undefined,
    sortBy,
    sortOrder,
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const {
    data: moderators = [],
    isLoading: isModeratorsLoading,
    isError: isModeratorsError,
  } = useModerators();
  if (isLoading) {
    return (
      <div className="space-y-4">
        <TableSkeleton columns={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <ApiError variant="alert" title="Could not load tickets" error={error} />
    );
  }

  const tickets = data?.items ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize);
  const hasActiveFilters = Boolean(
    search ||
    status.length > 0 ||
    priority.length > 0 ||
    categoryId ||
    assignee,
  );
  return (
    <div className="space-y-4">
      <TicketQueueFilters
        search={searchValue}
        onSearchChange={setSearchValue}
        status={status}
        priority={priority}
        categoryId={categoryId}
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        isCategoriesError={isCategoriesError}
        moderators={moderators}
        isModeratorsLoading={isModeratorsLoading}
        isModeratorsError={isModeratorsError}
        assignee={assignee}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onStatusToggle={toggleStatus}
        onPriorityToggle={togglePriority}
        onCategoryChange={(value) =>
          updateParams({
            category: value,
            page: "1",
          })
        }
        onAssigneeChange={(value) =>
          updateParams({
            assignee: value,
            page: "1",
          })
        }
        onSortChange={(newSortBy, newSortOrder) =>
          updateParams({
            sortBy: newSortBy,
            sortOrder: newSortOrder,
            page: "1",
          })
        }
      />

      {isFetching && !isLoading && (
        <div className="flex justify-end">
          <Spinner className="size-4" />
        </div>
      )}

      {tickets.length === 0 ? (
        <TicketEmptyState
          hasActiveFilters={hasActiveFilters}
          emptyDescription="There are currently no support tickets in the queue."
        />
      ) : (
        <QueueTicketTable
          tickets={tickets}
          onTicketClick={setSelectedTicketId}
        />
      )}

      <AppPagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={(newPage) =>
          updateParams({
            page: String(newPage),
          })
        }
        onPageSizeChange={(newPageSize) =>
          updateParams({
            pageSize: String(newPageSize),
            page: "1",
          })
        }
      />
      <TicketManagementDialog
        ticketId={selectedTicketId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTicketId(null);
          }
        }}
      />
    </div>
  );
}
