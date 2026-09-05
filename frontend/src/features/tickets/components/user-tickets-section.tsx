"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserTicketTable } from "@/features/tickets/components/user-ticket-table";
import { useTickets } from "@/features/tickets/hooks/use-tickets";
import type { TicketStatus } from "@/features/tickets/types/ticket";
import { UserTicketFilters } from "@/features/tickets/components/user-ticket-filters";
import { TicketDetailsDialog } from "@/features/tickets/components/ticket-details-dialog";
import { AppPagination } from "@/components/shared/app-pagination";
import { TicketEmptyState } from "@/components/shared/ticket-empty-state";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/components/shared/api-error";

function UserTicketsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const pageSizeParam = Number(searchParams.get("pageSize"));

  const pageSize = [10, 20, 50].includes(pageSizeParam) ? pageSizeParam : 10;

  const search = searchParams.get("search") ?? "";
  const statusParam = searchParams.get("status");
  const status = statusParam ? (statusParam as TicketStatus) : undefined;
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { data, isLoading, isError, isFetching, error } = useTickets({
    page,
    pageSize,
    search: search || undefined,
    status: status ? [status] : undefined,
  });
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;
  const [searchInput, setSearchInput] = useState(search);
  const hasActiveFilters = Boolean(search || status);
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const value = searchInput.trim();

      if (value === search) {
        return;
      }

      updateParams({
        search: value || undefined,
        page: "1",
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, search, updateParams]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TableSkeleton columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <ApiError variant="alert" title="Could not load tickets" error={error} />
    );
  }

  return (
    <section className="mt-8">
      <UserTicketFilters
        search={searchInput}
        status={status}
        onSearchChange={setSearchInput}
        onStatusChange={(value) => {
          updateParams({
            status: value,
            page: "1",
          });
        }}
      />

      {isFetching && !isLoading && (
        <div className="flex justify-end">
          <Spinner className="size-4" />
        </div>
      )}

      {data?.total === 0 ? (
        <TicketEmptyState
          hasActiveFilters={hasActiveFilters}
          emptyDescription="Create your first support ticket to get started."
        />
      ) : (
        <div className="mt-6">
          <UserTicketTable
            tickets={data?.items ?? []}
            onTicketClick={setSelectedTicketId}
          />
        </div>
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

      <TicketDetailsDialog
        ticketId={selectedTicketId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTicketId(null);
          }
        }}
      />
    </section>
  );
}

export default UserTicketsSection;
